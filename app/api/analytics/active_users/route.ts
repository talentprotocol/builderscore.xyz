import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAnalyticsApiResponse, GoogleAnalyticsActiveUserData } from '@/app/types/googleAnalytics';

const PROPERTY_ID = process.env.GA_PROPERTY_ID;

export async function GET() {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    const formattedData = response.rows?.map((row) => {
      const date = row.dimensionValues?.[0].value || '';
      const formattedDate = date
        ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`
        : '';
      const activeUsers = parseInt(row.metricValues?.[0].value || '0', 10);
      
      return {
        date: formattedDate,
        activeUsers,
      } as GoogleAnalyticsActiveUserData;
    }) || [];

    formattedData.sort((a: GoogleAnalyticsActiveUserData, b: GoogleAnalyticsActiveUserData) => 
      a.date.localeCompare(b.date)
    );

    const apiResponse: GoogleAnalyticsApiResponse = {
      success: true,
      data: formattedData
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    
    const errorResponse: GoogleAnalyticsApiResponse = {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 