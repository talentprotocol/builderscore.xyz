# Script Grants Analytics

require "securerandom"
require "net/http"
require "uri"
require "csv"
require "langchain"

# Configuration - Enable/disable file generation
GENERATE_ACTIVATION_RATE = false
GENERATE_GROWTH = false
GENERATE_RETENTION = false
GENERATE_DEV_SUMMARIES = false
GENERATE_SUMMARY_OF_SUMMARIES = false
GENERATE_TOTALS = true
GENERATE_DAILY_ACTIVITY = false
GENERATE_WEEKLY_ACTIVITY = false
GENERATE_DEVELOPER_ACTIVITY = false
GENERATE_ACTIVITY_BY_TYPE = false
GENERATE_REWARDS_BREAKDOWN = false
GENERATE_WINNERS_PROFILE = false
GENERATE_TOP_BUILDERS = false
GENERATE_LEADERBOARDS = false
GENERATE_ACTIVITY_METRICS = false
GENERATE_RETENTION_METRICS = false
GENERATE_MONTHLY_ACTIVITY = false
GENERATE_WEEKLY_REWARDS = false
GENERATE_ALL_TIME_REWARDS = false

# Input parameter - Grant Sponsor Slug
grant_sponsor_slug = "celo"
grant_sponsor_name = grant_sponsor_slug.capitalize
puts "Fetching data for Grant Sponsor with slug: #{grant_sponsor_slug}"

# Find the Grant Sponsor
grant_sponsor = BuilderGrants::Sponsor.find_by(slug: grant_sponsor_slug)
if grant_sponsor.nil?
  puts "Error: Grant Sponsor with slug '#{grant_sponsor_slug}' not found!"
  exit
end
puts "Found Grant Sponsor: #{grant_sponsor.id} (slug: #{grant_sponsor_slug})"

# Create a base filename with sponsor slug (no datetime)
base_filename = "rewards_sponsor_metrics"
filebin_id = "buildergrants-#{grant_sponsor_slug}-#{Time.now.strftime("%Y%m%d")}-#{SecureRandom.alphanumeric(4)}"

puts "Using filebin ID: #{filebin_id}"

# Get all completed grants for this sponsor ordered by end date
grants = BuilderGrants::Grant
  .where(builder_grant_sponsor_id: grant_sponsor.id)
  .where(status: "completed")
  .order(end_date: :asc)

if grants.empty?
  puts "No completed grants found for this sponsor!"
  exit
end

puts "Found #{grants.count} completed grants for this sponsor"

# Create filenames for all our data exports
activation_rate_file = "#{base_filename}_activation_rate.csv"
activation_rate_path = "/tmp/#{activation_rate_file}"

growth_file = "#{base_filename}_growth.csv"
growth_path = "/tmp/#{growth_file}"

retention_file = "#{base_filename}_retention.csv"
retention_path = "/tmp/#{retention_file}"

# Add file for developer summaries (top 100 for each grant)
dev_summaries_file = "#{base_filename}_dev_summaries.csv"
dev_summaries_path = "/tmp/#{dev_summaries_file}"

# Add new file for the AI-generated meta-summary
summary_of_summaries_file = "#{base_filename}_summary_of_summaries.txt"
summary_of_summaries_path = "/tmp/#{summary_of_summaries_file}"

# Add new file for totals metrics
totals_file = "#{base_filename}_totals.csv"
totals_path = "/tmp/#{totals_file}"

# Add new files for daily and weekly activity metrics
daily_activity_file = "#{base_filename}_daily_activity.csv"
daily_activity_path = "/tmp/#{daily_activity_file}"

weekly_activity_file = "#{base_filename}_weekly_activity.csv"
weekly_activity_path = "/tmp/#{weekly_activity_file}"

# Add new file for developer activity metrics
developer_activity_file = "#{base_filename}_developer_activity.csv"
developer_activity_path = "/tmp/#{developer_activity_file}"

# Add new file for activity by type metrics (weekly)
activity_by_type_file = "#{base_filename}_activity_by_type.csv"
activity_by_type_path = "/tmp/#{activity_by_type_file}"

# Add new file for rewards breakdown metrics
rewards_breakdown_file = "#{base_filename}_rewards_breakdown.csv"
rewards_breakdown_path = "/tmp/#{rewards_breakdown_file}"

# Add new file for winners profile metrics
winners_profile_file = "#{base_filename}_winners_profile.csv"
winners_profile_path = "/tmp/#{winners_profile_file}"

# Add new file for top builders leaderboard
top_builders_file = "#{base_filename}_top_builders.csv"
top_builders_path = "/tmp/#{top_builders_file}"

# Summary data structure to store metrics by grant
grant_metrics = []
all_grants_top_builders = []
summaries_by_grant = {}
dev_activity_metrics = []

# Data structures for daily and weekly activity metrics
daily_activity_metrics = {}
weekly_activity_metrics = {}

# Data structure for activity by type metrics (weekly)
activity_by_type_metrics = {}

# Data structure for weekly retention metrics
weekly_retention_metrics = {}

# Data structure for rewards breakdown metrics
if grant_sponsor_slug == "base"
  rewards_breakdown = {
    one_time_recipients: 0,
    repeated_recipients: 0,
    base_builds_recipients: 0,
    buildathon_winners: 0
  }
elsif grant_sponsor_slug == "celo"
  rewards_breakdown = {
    one_time_recipients: 0,
    repeated_recipients: 0,
    self_xyz_recipients: 0,
  }
else
  rewards_breakdown = {
    one_time_recipients: 0,
    repeated_recipients: 0,
  }
end
# Data structure for winners profile metrics
builder_score_levels = {
  "Level 1 (Novice): 0-39": 0,      # 0-39
  "Level 2 (Apprentice): 40-79": 0,  # 40-79
  "Level 3 (Practitioner): 80-119": 0, # 80-119
  "Level 4 (Advanced): 120-169": 0,    # 120-169
  "Level 5 (Expert): 170-249": 0,      # 170-249
  "Level 6 (Master): 250+": 0       # 250+
}

# More granular experience buckets (in years)
github_experience_buckets = {
  "1 year": 0,
  "2 years": 0,
  "3 years": 0,
  "4 years": 0,
  "5 years": 0,
  "6 years": 0,
  "7 years": 0,
  "8 years": 0,
  "9 years": 0,
  "10+ years": 0,
  "No data": 0
}

onchain_experience_buckets = {
  "1 year": 0,
  "2 years": 0,
  "3 years": 0,
  "4 years": 0,
  "5 years": 0,
  "6 years": 0,
  "7 years": 0,
  "8 years": 0,
  "9 years": 0,
  "10+ years": 0,
  "No data": 0
}

# Track unique users across all grants
all_eligible_user_ids = Set.new
all_active_user_ids = Set.new
all_rewarded_user_ids = Set.new
all_final_grant_rewarded_user_ids = Set.new  # New set for tracking users rewarded in final grants

# Track weekly active/inactive users
all_weeks = Set.new
grants.each do |grant|
  start_week = grant.start_date.to_date.beginning_of_week
  end_week = grant.end_date.to_date.beginning_of_week
  current_week = start_week

  while current_week <= end_week
    all_weeks.add(current_week)
    current_week += 1.week
  end
end

# Initialize weekly retention metrics for all weeks
all_weeks.sort.each do |week|
  weekly_retention_metrics[week] = {
    active_devs: 0,
    inactive_devs: 0,
    retention_rate: 0
  }
end

# Process each grant to calculate metrics
puts "\nProcessing grants to calculate metrics..."
grants.each_with_index do |grant, index|
  puts "Processing grant #{index + 1}/#{grants.count}: ID #{grant.id} (ended: #{grant.end_date})"

  # Get total eligible users
  eligible_users = BuilderGrants::User.where(builder_grant_id: grant.id)
  eligible_count = eligible_users.count

  # Get users with score > 0
  active_users = eligible_users.where("score > 0")
  active_count = active_users.count

  # Get users receiving rewards (reward_amount > 0)
  rewarded_users = eligible_users.where("reward_amount > 0")
  rewarded_count = rewarded_users.count

  # Calculate activation rate based on score > 0
  activation_rate = (eligible_count > 0) ? (active_count.to_f / eligible_count * 100).round(2) : 0

  # Get user IDs for ALL eligible users
  all_user_ids = eligible_users.pluck(:grantable_id, :grantable_type)

  # Get user IDs for active users (score > 0)
  active_user_ids = active_users.pluck(:grantable_id, :grantable_type)

  # Get user IDs for rewarded users (reward_amount > 0)
  rewarded_user_ids = rewarded_users.pluck(:grantable_id, :grantable_type)

  # Add to our sets of unique users across all grants
  all_eligible_user_ids.merge(all_user_ids)
  all_active_user_ids.merge(active_user_ids)
  all_rewarded_user_ids.merge(rewarded_user_ids)

  # Only add to final grant rewarded set if this is a final grant
  if grant.track_type == "final"
    all_final_grant_rewarded_user_ids.merge(rewarded_user_ids)
  end

  # Process daily metrics
  (grant.start_date.to_date..grant.end_date.to_date).each do |date|
    # For each date in the grant period, collect users who registered on this date
    daily_eligible_users = eligible_users.where("created_at::date = ?", date).count

    # Track active users for this day (this is an approximation as we don't have daily activity data)
    # In a real scenario, you'd want to track when activity actually happened
    daily_active_users = active_users.where("created_at::date = ?", date).count

    # Store daily metrics
    daily_activity_metrics[date] ||= {
      new_eligible_devs: 0,
      active_devs: 0,
      activation_rate: 0
    }

    # Add this grant's metrics to the day's total
    daily_activity_metrics[date][:new_eligible_devs] += daily_eligible_users
    daily_activity_metrics[date][:active_devs] += daily_active_users

    # Recalculate the activation rate based on the cumulative totals
    total_daily_eligible = daily_activity_metrics[date][:new_eligible_devs]
    total_daily_active = daily_activity_metrics[date][:active_devs]
    daily_activity_metrics[date][:activation_rate] = (total_daily_eligible > 0) ?
      (total_daily_active.to_f / total_daily_eligible * 100).round(2) : 0

    # Process weekly metrics (weeks starting on Monday)
    week_start = date.beginning_of_week

    weekly_activity_metrics[week_start] ||= {
      new_eligible_devs: 0,
      active_devs: 0,
      total_eligible_for_week: 0 # We'll use this to calculate the weekly activation rate
    }

    weekly_activity_metrics[week_start][:new_eligible_devs] += daily_eligible_users
    weekly_activity_metrics[week_start][:active_devs] += daily_active_users
    weekly_activity_metrics[week_start][:total_eligible_for_week] += daily_eligible_users
  end

  # Find users with GitHub activity
  github_users_count = BuilderGrants::UserMetric.joins(:builder_grant_user)
    .where(builder_grant_users: {builder_grant_id: grant.id})
    .where(category: "github")
    .where("raw_value > 0")
    .select("DISTINCT builder_grant_user_id")
    .count

  # Find users with smart contract activity
  onchain_users_count = BuilderGrants::UserMetric.joins(:builder_grant_user)
    .where(builder_grant_users: {builder_grant_id: grant.id})
    .where(category: "onchain")
    .where("raw_value > 0")
    .select("DISTINCT builder_grant_user_id")
    .count

  # Store in our metrics array for other calculations
  grant_metrics << {
    grant_id: grant.id,
    start_date: grant.start_date,
    end_date: grant.end_date,
    eligible_users: eligible_count,
    active_users: active_count,
    rewarded_users: rewarded_count,
    activation_rate: activation_rate,
    active_user_ids: active_user_ids,
    all_user_ids: all_user_ids
  }

  puts "  Eligible builders: #{eligible_count}"
  puts "  Builders with activity (score > 0): #{active_count} (#{activation_rate}%)"
  puts "  Builders receiving rewards: #{rewarded_count}"
  puts "  Builders with GitHub activity: #{github_users_count} (#{(github_users_count.to_f / eligible_count * 100).round(2)}%)"
  puts "  Builders with #{grant_sponsor_name} contract activity: #{onchain_users_count} (#{(onchain_users_count.to_f / eligible_count * 100).round(2)}%)"

  # Store developer activity metrics
  dev_activity_metrics << {
    grant_id: grant.id,
    start_date: grant.start_date,
    end_date: grant.end_date,
    eligible_users: eligible_count,
    active_users: active_count,
    rewarded_users: rewarded_count,
    github_users: github_users_count,
    onchain_users: onchain_users_count,
    github_percentage: (eligible_count > 0) ? (github_users_count.to_f / eligible_count * 100).round(2) : 0,
    onchain_percentage: (eligible_count > 0) ? (onchain_users_count.to_f / eligible_count * 100).round(2) : 0
  }

  # Count total GitHub repos and smart contracts tracked for this grant period
  # Count unique GitHub repositories
  github_metrics = BuilderGrants::UserMetric.joins(:builder_grant_user)
    .where(builder_grant_users: {builder_grant_id: grant.id})
    .where(category: "github")
    .pluck(:metric_name, :metadata)

  # Extract unique repositories from metadata
  unique_github_repos = Set.new

  github_metrics.each do |metric_name, metadata|
    if metadata.present?
      if metric_name == "approved_commits" && metadata["approved_repos"].present?
        unique_github_repos.merge(metadata["approved_repos"].keys)
      elsif metric_name == "total_contributions" && metadata["contribution_repos"].present?
        unique_github_repos.merge(metadata["contribution_repos"].keys)
      end
    end
  end

  total_github_repos = unique_github_repos.size

  # Count unique smart contracts created or interacted with
  onchain_metrics = BuilderGrants::UserMetric.joins(:builder_grant_user)
    .where(builder_grant_users: {builder_grant_id: grant.id})
    .where(category: "onchain")
    .where(metric_name: "contract_creations")
    .pluck(:metadata)

  # Extract unique contract addresses from metadata
  unique_onchain_contracts = Set.new

  onchain_metrics.each do |metadata|
    if metadata.present? && metadata["contracts"].present?
      unique_onchain_contracts.merge(metadata["contracts"].keys)
    end
  end

  total_onchain_contracts = unique_onchain_contracts.size

  puts "  Total GitHub repos tracked: #{total_github_repos}"
  puts "  Total #{grant_sponsor_name} contracts tracked: #{total_onchain_contracts}"

  # Add weekly data points for activity by type
  # Week starts on Monday
  week_start = grant.start_date.to_date.beginning_of_week
  week_end = grant.end_date.to_date.end_of_week

  while week_start <= week_end
    # Initialize the week's metrics if not already present
    activity_by_type_metrics[week_start] ||= {
      github_users: 0,
      github_repos: 0,
      onchain_users: 0,
      onchain_contracts: 0
    }

    # Add the metrics for this grant's week (will be overwritten if multiple grants in same week)
    # For non-overlapping grants this is fine; for overlapping grants, we'd need to improve this logic
    activity_by_type_metrics[week_start][:github_users] = github_users_count
    activity_by_type_metrics[week_start][:github_repos] = total_github_repos
    activity_by_type_metrics[week_start][:onchain_users] = onchain_users_count
    activity_by_type_metrics[week_start][:onchain_contracts] = total_onchain_contracts

    # Move to next week
    week_start += 1.week
  end

  # Get top 100 builders for this specific grant
  puts "  Getting top 100 builders for grant ID #{grant.id}"

  top_builders_for_grant = BuilderGrants::User
    .where(builder_grant_id: grant.id)
    .where("score > 0")
    .order(score: :desc)
    .limit(100)

  top_builders_count = top_builders_for_grant.count
  puts "  Found #{top_builders_count} builders with score > 0 for this grant"

  # Initialize array for this grant's summaries
  summaries_by_grant[grant.id] = {
    start_date: grant.start_date,
    end_date: grant.end_date,
    summaries: []
  }

  if top_builders_count > 0
    top_builders_data = []

    top_builders_for_grant.each_with_index do |builder, builder_index|
      # Get metrics for this builder
      github_metrics = BuilderGrants::UserMetric
        .where(builder_grant_user_id: builder.id)
        .where(category: "github")

      onchain_metrics = BuilderGrants::UserMetric
        .where(builder_grant_user_id: builder.id)
        .where(category: "onchain")

      # Extract metrics of interest
      github_activity = github_metrics.sum(:raw_value)
      onchain_activity = onchain_metrics.sum(:raw_value)

      summary = builder.summary || "No summary available"

      # Store builder data for CSV export
      top_builders_data << {
        rank: builder_index + 1,
        user_id: builder.grantable_id,
        grant_id: grant.id,
        grant_start_date: grant.start_date,
        grant_end_date: grant.end_date,
        score: builder.score,
        reward_amount: builder.reward_amount,
        github_activity: github_activity,
        onchain_activity: onchain_activity,
        summary: summary
      }

      # Only collect non-empty summaries
      if summary != "No summary available" && !summary.blank?
        summaries_by_grant[grant.id][:summaries] << {
          rank: builder_index + 1,
          user_id: builder.grantable_id,
          score: builder.score,
          summary: summary
        }
      end
    end

    # Add this grant's top builders to the overall collection
    all_grants_top_builders.concat(top_builders_data)
  end
end

# Get the latest grant date for "today's date" in the totals
latest_grant = grants.last
today_date = latest_grant.end_date

# Calculate totals for the metrics
# For eligible devs, only use the latest grant (today)
latest_eligible_user_ids = BuilderGrants::User.where(builder_grant_id: latest_grant.id).pluck(:grantable_id, :grantable_type).to_set
total_eligible_devs = latest_eligible_user_ids.size

# For active and rewarded devs, use accumulated unique counts across all time
total_active_devs = all_active_user_ids.size
total_rewarded_devs = all_final_grant_rewarded_user_ids.size

# We need to extract the account_ids from active users
eligible_account_ids = []

# Process active users to get their account IDs
# Note: grantable is only ever a User or Profile (never an Account)
active_grantable_ids_with_types = all_active_user_ids.to_a
puts "Processing #{active_grantable_ids_with_types.size} active grantables"

# Group grantable_ids by type for efficient querying
grantable_ids_by_type = active_grantable_ids_with_types.group_by { |_, type| type }

# Process Profile grantables
if grantable_ids_by_type["Profile"]
  profile_ids = grantable_ids_by_type["Profile"].map(&:first)
  puts "Found #{profile_ids.size} Profile grantables"

  Profile.where(id: profile_ids).find_each do |profile|
    # Looking at Profile model, we need to handle this differently
    if profile.user.present?
      # If profile has a user, get accounts through the user
      user_accounts = profile.user.all_accounts
      eligible_account_ids.concat(user_accounts.pluck(:id)) if user_accounts.any?
    elsif profile.account_id.present?
      # If profile has a direct account, use that
      eligible_account_ids << profile.account_id
    end
  end
end

# Process User grantables
if grantable_ids_by_type["User"]
  user_ids = grantable_ids_by_type["User"].map(&:first)
  puts "Found #{user_ids.size} User grantables"

  User.where(id: user_ids).find_each do |user|
    user_accounts = user.all_accounts
    eligible_account_ids.concat(user_accounts.pluck(:id)) if user_accounts.any?
  end
end

eligible_account_ids.compact!
eligible_account_ids.uniq!

puts "Found #{eligible_account_ids.size} unique account IDs from #{all_active_user_ids.size} active users"

# Count devs with active contracts
devs_with_active_contracts = DataPoint
  .joins(:credential)
  .where(account_id: eligible_account_ids)
  .where(credentials: {slug: "#{grant_sponsor_slug}_mainnet_active_contracts"})
  .where("value_i > 0")
  .select(:account_id)
  .distinct
  .count

# Count devs with contracts deployed
devs_with_deployed_contracts = DataPoint
  .joins(:credential)
  .where(account_id: eligible_account_ids)
  .where(credentials: {slug: "#{grant_sponsor_slug}_mainnet_contracts_deployed"})
  .where("value_i > 0")
  .select(:account_id)
  .distinct
  .count

puts "\nCalculated totals:"
puts "  Eligible developers (unique, latest period only): #{total_eligible_devs}"
puts "  Active developers (unique, accumulated all time): #{total_active_devs}"
puts "  Rewarded developers (unique, accumulated all time): #{total_rewarded_devs}"
puts "  Active developers with #{grant_sponsor_name} Mainnet active contracts: #{devs_with_active_contracts}"
puts "  Active developers with #{grant_sponsor_name} Mainnet contracts deployed: #{devs_with_deployed_contracts}"

# Now calculate growth and retention based on the collected data
puts "\nCalculating week-over-week metrics..."

growth_data = []
all_users_retention_data = []

# Process each week
prev_active_users = nil
all_weeks.sort.each_with_index do |week, week_index|
  week_end = week + 6.days

  # Find grants active during this week
  active_grants = grants.select do |grant|
    (grant.start_date.to_date <= week_end) && (grant.end_date.to_date >= week)
  end

  # If no grants are active this week, skip
  next if active_grants.empty?

  # Find all active users for grants in this week
  current_active_users = Set.new
  active_grants.each do |grant|
    BuilderGrants::User.where(builder_grant_id: grant.id)
      .where("score > 0")
      .pluck(:grantable_id, :grantable_type)
      .each { |id, type| current_active_users.add([id, type]) }
  end

  # Calculate retention rate if we have data from previous week
  if prev_active_users && prev_active_users.any?
    retained_users = prev_active_users & current_active_users
    retention_rate = (retained_users.size.to_f / prev_active_users.size * 100).round(2)

    # Count inactive devs (devs who were active last week but not this week)
    inactive_devs = prev_active_users - current_active_users

    weekly_retention_metrics[week] = {
      active_devs: current_active_users.size,
      inactive_devs: inactive_devs.size,
      retention_rate: retention_rate
    }
  else
    # For the first week, set retention rate to 100%
    weekly_retention_metrics[week] = {
      active_devs: current_active_users.size,
      inactive_devs: 0,
      retention_rate: 100.0
    }
  end

  # Update previous active users for next iteration
  prev_active_users = current_active_users
end

# Original grant-to-grant retention calculation
grant_metrics.each_with_index do |current, index|
  # Skip the first one for growth calculation as we need a previous week
  unless index == 0
    previous = grant_metrics[index - 1]

    # Growth calculation
    net_growth = current[:eligible_users] - previous[:eligible_users]
    growth_percentage = (previous[:eligible_users] > 0) ?
      (net_growth.to_f / previous[:eligible_users] * 100).round(2) : 0

    growth_data << {
      start_date: current[:start_date],
      end_date: current[:end_date],
      previous_eligible: previous[:eligible_users],
      current_eligible: current[:eligible_users],
      net_growth: net_growth,
      growth_percentage: growth_percentage
    }

    # Retention calculation for ALL eligible users
    previous_all_ids = previous[:all_user_ids]
    current_all_ids = current[:all_user_ids]

    # Find overlap (retained users)
    retained_all_users = previous_all_ids & current_all_ids
    retained_all_count = retained_all_users.length

    # New users (in current but not in previous)
    new_all_users = current_all_ids - previous_all_ids
    new_all_count = new_all_users.length

    # Leaving users (in previous but not in current)
    leaving_all_users = previous_all_ids - current_all_ids
    leaving_all_count = leaving_all_users.length

    # Calculate retention rate for all users
    all_retention_rate = (previous_all_ids.length > 0) ?
      (retained_all_count.to_f / previous_all_ids.length * 100).round(2) : 0

    all_users_retention_data << {
      start_date: current[:start_date],
      end_date: current[:end_date],
      previous_users: previous_all_ids.length,
      current_users: current_all_ids.length,
      retained_users: retained_all_count,
      retention_rate: all_retention_rate,
      new_users: new_all_count,
      leaving_users: leaving_all_count
    }
  end
end

# Calculate rewards breakdown metrics
puts "\nCalculating rewards breakdown metrics..."

# First, identify users who received rewards in multiple grants
rewarded_users_by_grant = {}
grants.each do |grant|
  BuilderGrants::User.where(builder_grant_id: grant.id)
    .where("reward_amount > 0")
    .pluck(:grantable_id, :grantable_type).each do |id, type|
      rewarded_users_by_grant[id] ||= []
      rewarded_users_by_grant[id] << grant.id
    end
end

# Count users who received rewards in exactly one grant vs multiple grants
one_time_recipients = rewarded_users_by_grant.count { |_, grant_ids| grant_ids.size == 1 }
repeated_recipients = rewarded_users_by_grant.count { |_, grant_ids| grant_ids.size > 1 }

# Process each rewarded user to check for special credentials
rewarded_users_by_grant.each do |user_id, grant_ids|
  # Find the grantable record (User or Profile)
  grantable_record = nil
  grantable_type = BuilderGrants::User.where(grantable_id: user_id).first&.grantable_type

  if grantable_type == "Profile"
    grantable_record = Profile.find_by(id: user_id)
  elsif grantable_type == "User"
    grantable_record = User.find_by(id: user_id)
  end

  next unless grantable_record

  # Get account IDs associated with this user
  account_ids = []
  if grantable_record.is_a?(Profile)
    if grantable_record.user.present?
      # If profile has a user, get accounts through the user
      account_ids = grantable_record.user.all_accounts.pluck(:id)
    elsif grantable_record.account_id.present?
      # If profile has a direct account, use that
      account_ids = [grantable_record.account_id]
    end
  elsif grantable_record.is_a?(User)
    # Get all accounts associated with the user
    account_ids = grantable_record.all_accounts.pluck(:id)
  end

  next if account_ids.empty?

  if grant_sponsor_slug == "base"
    # Check for base_builds_earnings
    has_base_builds = DataPoint
      .joins(:credential)
      .where(account_id: account_ids)
      .where(credentials: {slug: "base_builds_earnings"})
      .where("value_i > 0")
      .exists?

    rewards_breakdown[:base_builds_recipients] += 1 if has_base_builds

    # Check for buildathon winner credentials
    has_buildathon_winner = DataPoint
      .joins(:credential)
      .where(account_id: account_ids)
      .where(credentials: {slug: ["base_batw_winner", "base_buildathon_winner"]})
      .where("value_i > 0")
      .exists?

    rewards_breakdown[:buildathon_winners] += 1 if has_buildathon_winner
  elsif grant_sponsor_slug == "celo"
    has_self_xyz = DataPoint
      .joins(:credential)
      .where(account_id: account_ids)
      .where(credentials: {slug: "self_verification"})
      .where("value_i > 0")
      .exists?

    rewards_breakdown[:self_xyz_recipients] += 1 if has_self_xyz
  end
end

# Update total counts
rewards_breakdown[:one_time_recipients] = one_time_recipients
rewards_breakdown[:repeated_recipients] = repeated_recipients

puts "  One-time recipients: #{rewards_breakdown[:one_time_recipients]}"
puts "  Repeated recipients: #{rewards_breakdown[:repeated_recipients]}"
if grant_sponsor_slug == "base"
  puts "  Base-builds recipients: #{rewards_breakdown[:base_builds_recipients]}"
  puts "  Buildathon winners: #{rewards_breakdown[:buildathon_winners]}"
elsif grant_sponsor_slug == "celo"
  puts "  Self-XYZ recipients: #{rewards_breakdown[:self_xyz_recipients]}"
end

# Calculate winners profile metrics
puts "\nCalculating winners profile metrics..."

puts "Found #{all_rewarded_user_ids.size} unique users who received rewards"

# Process each unique rewarded user
all_rewarded_user_ids.each do |grantable_id_and_type|
  grantable_id, grantable_type = grantable_id_and_type

  # Find the grantable record
  grantable = nil
  if grantable_type == "Profile"
    grantable = Profile.find_by(id: grantable_id)
  elsif grantable_type == "User"
    grantable = User.find_by(id: grantable_id)
  end

  next unless grantable

  # Get account IDs associated with this user
  account_ids = []
  if grantable.is_a?(Profile)
    if grantable.user.present?
      # If profile has a user, get accounts through the user
      account_ids = grantable.user.all_accounts.pluck(:id)
    elsif grantable.account_id.present?
      # If profile has a direct account, use that
      account_ids = [grantable.account_id]
    end
  elsif grantable.is_a?(User)
    # Get all accounts associated with the user
    account_ids = grantable.all_accounts.pluck(:id)
  end

  next if account_ids.empty?

  # Find the user's builder score from the most recent grant
  builder_grant_user = BuilderGrants::User
    .where(grantable_id: grantable_id, grantable_type: grantable_type)
    .order(created_at: :desc)
    .first

  next unless builder_grant_user

  # Calculate builder score level
  user_builder_score = builder_grant_user.builder_score || 0
  # Determine level based on score
  if user_builder_score < 40
    builder_score_levels[:"Level 1 (Novice): 0-39"] += 1
  elsif user_builder_score < 80
    builder_score_levels[:"Level 2 (Apprentice): 40-79"] += 1
  elsif user_builder_score < 120
    builder_score_levels[:"Level 3 (Practitioner): 80-119"] += 1
  elsif user_builder_score < 170
    builder_score_levels[:"Level 4 (Advanced): 120-169"] += 1
  elsif user_builder_score < 250
    builder_score_levels[:"Level 5 (Expert): 170-249"] += 1
  else
    builder_score_levels[:"Level 6 (Master): 250+"] += 1
  end

  # Get account age data points
  github_age_data = DataPoint
    .joins(:credential)
    .where(account_id: account_ids)
    .where(credentials: {slug: "github_account_age"})
    .order(value_i: :desc)
    .first

  wallet_age_data = DataPoint
    .joins(:credential)
    .where(account_id: account_ids)
    .where(credentials: {slug: "onchain_account_age"})
    .order(value_i: :desc)
    .first

  # Convert timestamps to years of experience
  now = Time.now.to_i

  # Calculate GitHub experience in years
  github_age_in_years = 0
  if github_age_data.present?
    github_timestamp = github_age_data.value_i
    github_age_in_seconds = now - github_timestamp
    github_age_in_years = github_age_in_seconds / (365.0 * 24 * 60 * 60)

    # Increment appropriate GitHub experience bucket
    if github_age_in_years < 1
      github_experience_buckets[:"1 year"] += 1
    elsif github_age_in_years < 2
      github_experience_buckets[:"2 years"] += 1
    elsif github_age_in_years < 3
      github_experience_buckets[:"3 years"] += 1
    elsif github_age_in_years < 4
      github_experience_buckets[:"4 years"] += 1
    elsif github_age_in_years < 5
      github_experience_buckets[:"5 years"] += 1
    elsif github_age_in_years < 6
      github_experience_buckets[:"6 years"] += 1
    elsif github_age_in_years < 7
      github_experience_buckets[:"7 years"] += 1
    elsif github_age_in_years < 8
      github_experience_buckets[:"8 years"] += 1
    elsif github_age_in_years < 9
      github_experience_buckets[:"9 years"] += 1
    else
      github_experience_buckets[:"10+ years"] += 1
    end
  else
    github_experience_buckets[:"No data"] += 1
  end

  # Calculate onchain experience in years
  onchain_age_in_years = 0
  if wallet_age_data.present?
    wallet_timestamp = wallet_age_data.value_i
    wallet_age_in_seconds = now - wallet_timestamp
    onchain_age_in_years = wallet_age_in_seconds / (365.0 * 24 * 60 * 60)

    # Increment appropriate onchain experience bucket
    if onchain_age_in_years < 1
      onchain_experience_buckets[:"1 year"] += 1
    elsif onchain_age_in_years < 2
      onchain_experience_buckets[:"2 years"] += 1
    elsif onchain_age_in_years < 3
      onchain_experience_buckets[:"3 years"] += 1
    elsif onchain_age_in_years < 4
      onchain_experience_buckets[:"4 years"] += 1
    elsif onchain_age_in_years < 5
      onchain_experience_buckets[:"5 years"] += 1
    elsif onchain_age_in_years < 6
      onchain_experience_buckets[:"6 years"] += 1
    elsif onchain_age_in_years < 7
      onchain_experience_buckets[:"7 years"] += 1
    elsif onchain_age_in_years < 8
      onchain_experience_buckets[:"8 years"] += 1
    elsif onchain_age_in_years < 9
      onchain_experience_buckets[:"9 years"] += 1
    else
      onchain_experience_buckets[:"10+ years"] += 1
    end
  else
    onchain_experience_buckets[:"No data"] += 1
  end
end

puts "  Builder Score Levels:"
builder_score_levels.each do |level, count|
  puts "    #{level}: #{count}"
end

puts "  GitHub Experience Buckets:"
github_experience_buckets.each do |bucket, count|
  puts "    #{bucket}: #{count}"
end

puts "  Onchain Experience Buckets:"
onchain_experience_buckets.each do |bucket, count|
  puts "    #{bucket}: #{count}"
end

# Generate AI summaries of the summaries for each grant period
puts "\nGenerating AI summaries of the summaries for each grant period..."

all_grant_meta_summaries = []

if GENERATE_SUMMARY_OF_SUMMARIES
  # Initialize the LLM
  llm = Langchain::LLM::OpenAI.new(
    api_key: ENV["OPENAI_API_KEY"],
    default_options: {temperature: 0.7, chat_completion_model_name: "gpt-4o"}
  )

  summaries_by_grant.each do |grant_id, grant_data|
    grant_summaries = grant_data[:summaries]

    if grant_summaries.empty?
      puts "No summaries available for grant ID #{grant_id}"
      next
    end

    puts "Generating meta-summary for grant ID #{grant_id} (#{grant_summaries.length} summaries)"

    # Create a prompt for the LLM
    prompt = <<~PROMPT
      You are an expert analyst for #{grant_sponsor_name}, a Layer 2 solution on Ethereum. 
      
      I'm going to provide you with summaries of the activities of the top builders in the #{grant_sponsor_name} ecosystem during the period from #{grant_data[:start_date].strftime("%Y-%m-%d")} to #{grant_data[:end_date].strftime("%Y-%m-%d")}.
      
      Please analyze these summaries and provide:
      
      1. The most common types of projects being built (categorize them)
      2. Emerging trends or patterns you notice
      3. Technical stacks or technologies that appear frequently
      4. Any notable achievements or innovations
      5. Overall assessment of builder activity during this period
      
      Focus on extracting actionable insights and patterns, not just summarizing the summaries.
      
      Here are the summaries (format: Rank, Score, Summary):
      
      #{grant_summaries.first(50).map { |s| "Rank #{s[:rank]} (Score: #{s[:score]}): #{s[:summary]}" }.join("\n\n")}
    PROMPT

    # If there are more than 50 summaries, we'll need to break them up
    # due to token limits. In a real implementation, you might want to
    # handle this more elegantly.

    begin
      messages = [
        {role: "user", content: prompt}
      ]

      response = llm.chat(messages: messages)
      meta_summary = response.chat_completion

      all_grant_meta_summaries << {
        grant_id: grant_id,
        start_date: grant_data[:start_date],
        end_date: grant_data[:end_date],
        builder_count: grant_summaries.length,
        meta_summary: meta_summary
      }

      puts "Generated meta-summary for grant ID #{grant_id}"
    rescue => e
      puts "Error generating meta-summary for grant ID #{grant_id}: #{e.message}"
    end
  end

  # Now generate an overall meta-summary across all grants
  puts "\nGenerating overall meta-summary across all grants..."

  if all_grant_meta_summaries.any?
    begin
      overall_prompt = <<~PROMPT
        You are an expert analyst for #{grant_sponsor_name}, a Layer 2 solution on Ethereum.
        
        I'm going to provide you with meta-summaries of builder activity across multiple Reward periods for #{grant_sponsor_name}.
        
        Please analyze these meta-summaries and provide:
        
        1. How the #{grant_sponsor_name} ecosystem has evolved over time
        2. Major trends or shifts in developer focus
        3. Consistent patterns across all periods
        4. Growth indicators or areas of innovation
        5. Overall assessment of the #{grant_sponsor_name} ecosystem health and direction
        
        Focus on extracting actionable insights and patterns that would be valuable for strategic planning.
        
        Here are the meta-summaries by Reward period:
        
        #{all_grant_meta_summaries.map { |s| "Period: #{s[:start_date].strftime("%Y-%m-%d")} to #{s[:end_date].strftime("%Y-%m-%d")} (#{s[:builder_count]} builders)\n\n#{s[:meta_summary]}" }.join("\n\n---\n\n")}
      PROMPT

      messages = [
        {role: "user", content: overall_prompt}
      ]

      response = llm.chat(messages: messages)
      overall_meta_summary = response.chat_completion

      puts "Generated overall meta-summary across all grants"
    rescue => e
      puts "Error generating overall meta-summary: #{e.message}"
      overall_meta_summary = "Error generating overall meta-summary: #{e.message}"
    end
  else
    overall_meta_summary = "No grant meta-summaries available to generate an overall summary."
  end
else
  puts "Skipping AI summary generation (disabled in configuration)"
  overall_meta_summary = "AI summary generation disabled in configuration"
end

puts "\nWriting CSV files..."

activation_uploaded = false
growth_uploaded = false
retention_uploaded = false
totals_uploaded = false
summary_uploaded = false
dev_summaries_uploaded = false
daily_activity_uploaded = false
weekly_activity_uploaded = false
developer_activity_uploaded = false
activity_by_type_uploaded = false
rewards_breakdown_uploaded = false
winners_profile_uploaded = false
top_builders_uploaded = false

# 1. Write Developer Activation Rate CSV
if GENERATE_ACTIVATION_RATE
  CSV.open(activation_rate_path, "w") do |csv|
    csv << ["Reward Start Date", "Reward End Date", "Eligible Builders", "Builders with Activity (Score > 0)", "Activation Rate (%)"]

    grant_metrics.each do |metric|
      csv << [
        metric[:start_date],
        metric[:end_date],
        metric[:eligible_users],
        metric[:active_users],
        metric[:activation_rate]
      ]
    end
  end
  puts "Created activation rate CSV at #{activation_rate_path}"
end

# 2. Write Growth in Eligible Builders CSV
if GENERATE_GROWTH
  CSV.open(growth_path, "w") do |csv|
    csv << ["Reward Start Date", "Reward End Date", "Previous Eligible Builders", "Current Eligible Builders", "Net Growth", "Growth Percentage (%)"]

    growth_data.each do |data|
      csv << [
        data[:start_date],
        data[:end_date],
        data[:previous_eligible],
        data[:current_eligible],
        data[:net_growth],
        data[:growth_percentage]
      ]
    end
  end
  puts "Created growth CSV at #{growth_path}"
end

# 3. Write Developer Retention CSV for All Users
if GENERATE_RETENTION
  CSV.open(retention_path, "w") do |csv|
    csv << ["Week Start Date", "Total Active Devs", "Total Inactive Devs", "Retention Rate (%)"]

    weekly_retention_metrics.keys.sort.each do |week|
      metrics = weekly_retention_metrics[week]
      csv << [
        week,
        metrics[:active_devs],
        metrics[:inactive_devs],
        metrics[:retention_rate]
      ]
    end
  end
  puts "Created builders retention CSV at #{retention_path}"
end

# 4. Write Developer Activity CSV
if GENERATE_DEV_SUMMARIES && all_grants_top_builders.any?
  CSV.open(dev_summaries_path, "w") do |csv|
    csv << ["Rank", "Builder ID", "Grant ID", "Grant Start Date", "Grant End Date", "Score", "Reward Amount",
            "GitHub Activity", "Onchain Activity", "Summary"]

    all_grants_top_builders.each do |data|
      csv << [
        data[:rank],
        data[:user_id],
        data[:grant_id],
        data[:grant_start_date],
        data[:grant_end_date],
        data[:score],
        data[:reward_amount],
        data[:github_activity],
        data[:onchain_activity],
        data[:summary]
      ]
    end
  end
  puts "Created top builders summaries CSV at #{dev_summaries_path} (includes up to 100 builders per grant)"
  puts "Total builders in summary file: #{all_grants_top_builders.length}"
end

# 5. Write Totals CSV with metric cards
if GENERATE_TOTALS
  CSV.open(totals_path, "w") do |csv|
    csv << ["Today's Date", "Eligible Devs (unique, latest period only)", "Active Devs (unique, accumulated all time)", "Rewarded Devs (unique, accumulated all time)", "Active developers with #{grant_sponsor_name} Mainnet active contracts", "Active developers with #{grant_sponsor_name} Mainnet contracts deployed"]

    csv << [
      today_date,
      total_eligible_devs,
      total_active_devs,
      total_rewarded_devs,
      devs_with_active_contracts,
      devs_with_deployed_contracts
    ]
  end
  puts "Created totals metrics CSV at #{totals_path}"
end

# 6. Write Daily Activity CSV
if GENERATE_DAILY_ACTIVITY
  CSV.open(daily_activity_path, "w") do |csv|
    csv << ["Date", "New Eligible Devs", "Active Devs", "Activation Rate (%)"]

    # Sort by date before writing to CSV
    daily_activity_metrics.keys.sort.each do |date|
      metrics = daily_activity_metrics[date]
      csv << [
        date,
        metrics[:new_eligible_devs],
        metrics[:active_devs],
        metrics[:activation_rate]
      ]
    end
  end
  puts "Created daily builder activity CSV at #{daily_activity_path}"
end

# 7. Write Weekly Activity CSV
if GENERATE_WEEKLY_ACTIVITY
  CSV.open(weekly_activity_path, "w") do |csv|
    csv << ["Week Start Date (Monday)", "New Eligible Devs", "Active Devs", "Activation Rate (%)"]

    # Sort by week start date before writing to CSV
    weekly_activity_metrics.keys.sort.each do |week_start|
      metrics = weekly_activity_metrics[week_start]

      # Calculate weekly activation rate
      weekly_activation_rate = (metrics[:total_eligible_for_week] > 0) ?
        (metrics[:active_devs].to_f / metrics[:total_eligible_for_week] * 100).round(2) : 0

      csv << [
        week_start,
        metrics[:new_eligible_devs],
        metrics[:active_devs],
        weekly_activation_rate
      ]
    end
  end
  puts "Created weekly builder activity CSV at #{weekly_activity_path}"
end

# 8. Write Activity by Type CSV (weekly)
if GENERATE_ACTIVITY_BY_TYPE
  CSV.open(activity_by_type_path, "w") do |csv|
    csv << ["Week Start Date (Monday)", "Devs with GitHub Activity", "Total GitHub Repos",
            "Devs with #{grant_sponsor_name} Contract Activity", "Total #{grant_sponsor_name} Contracts"]

    # Sort by week start date before writing to CSV
    activity_by_type_metrics.keys.sort.each do |week_start|
      metrics = activity_by_type_metrics[week_start]

      csv << [
        week_start,
        metrics[:github_users],
        metrics[:github_repos],
        metrics[:onchain_users],
        metrics[:onchain_contracts]
      ]
    end
  end
  puts "Created weekly activity by type CSV at #{activity_by_type_path}"
end

# 9. Write Rewards Breakdown CSV
if GENERATE_REWARDS_BREAKDOWN
  CSV.open(rewards_breakdown_path, "w") do |csv|
    csv << ["Category", "Count", "Percentage of Total Rewarded"]

    total = (total_rewarded_devs > 0) ? total_rewarded_devs : 1 # Avoid division by zero

    # Add total rewarded users row
    csv << [
      "Total Rewarded Users",
      total_rewarded_devs,
      100.0
    ]

    # Add a blank row as separator
    csv << []

    csv << [
      "Builder Rewards (one-time)",
      rewards_breakdown[:one_time_recipients],
      (rewards_breakdown[:one_time_recipients].to_f / total * 100).round(2)
    ]

    csv << [
      "Builder Rewards (repeated recipient)",
      rewards_breakdown[:repeated_recipients],
      (rewards_breakdown[:repeated_recipients].to_f / total * 100).round(2)
    ]

    if grant_sponsor_slug == "base"
      csv << [
        "BR + Base-builds",
        rewards_breakdown[:base_builds_recipients],
        (rewards_breakdown[:base_builds_recipients].to_f / total * 100).round(2)
      ]

      csv << [
        "BR + Buildathon Winner",
        rewards_breakdown[:buildathon_winners],
        (rewards_breakdown[:buildathon_winners].to_f / total * 100).round(2)
      ]
    elsif grant_sponsor_slug == "celo"
      csv << [
        "BR + Self-XYZ",
        rewards_breakdown[:self_xyz_recipients],
        (rewards_breakdown[:self_xyz_recipients].to_f / total * 100).round(2)
      ]
    end
  end
  puts "Created rewards breakdown CSV at #{rewards_breakdown_path}"
end

# 10. Write Winners Profile CSV
if GENERATE_WINNERS_PROFILE
  # Calculate total rewarded users for percentages
  total_profiled_users = builder_score_levels.values.sum
  total_profiled_users = 1 if total_profiled_users == 0 # Avoid division by zero

  # Write Builder Score Levels CSV
  CSV.open(winners_profile_path, "w") do |csv|
    csv << ["Category", "Metric", "Count", "Percentage"]

    # Write Builder Score Levels section
    builder_score_levels.each do |level, count|
      csv << [
        "Builder Score",
        level.to_s,
        count,
        (count.to_f / total_profiled_users * 100).round(2)
      ]
    end

    # Add a separator row
    csv << []

    # Write GitHub Experience Buckets section
    github_experience_buckets.each do |bucket, count|
      csv << [
        "GitHub Experience",
        bucket.to_s,
        count,
        (count.to_f / total_profiled_users * 100).round(2)
      ]
    end

    # Write Onchain Experience Buckets section
    onchain_experience_buckets.each do |bucket, count|
      csv << [
        "Onchain Experience",
        bucket.to_s,
        count,
        (count.to_f / total_profiled_users * 100).round(2)
      ]
    end
  end
  puts "Created winners profile CSV at #{winners_profile_path}"
end

# 11. Write Developer Activity CSV
if GENERATE_DEVELOPER_ACTIVITY
  CSV.open(developer_activity_path, "w") do |csv|
    csv << [
      "Reward Start Date", "Reward End Date", "Eligible Builders", "Builders with Activity (Score > 0)",
      "Builders Receiving Rewards", "Builders with GitHub Activity", "GitHub Activity %",
      "Builders with #{grant_sponsor_name} Contract Activity", "#{grant_sponsor_name} Contract Activity %"
    ]

    dev_activity_metrics.each do |data|
      csv << [
        data[:start_date],
        data[:end_date],
        data[:eligible_users],
        data[:active_users],
        data[:rewarded_users],
        data[:github_users],
        data[:github_percentage],
        data[:onchain_users],
        data[:onchain_percentage]
      ]
    end
  end
  puts "Created builder activity CSV at #{developer_activity_path}"
end

# 12. Write Summary of Summaries text file
if GENERATE_SUMMARY_OF_SUMMARIES
  File.open(summary_of_summaries_path, "w") do |file|
    file.puts "# #{grant_sponsor_name} Ecosystem Analysis: Summary of Builder Activities\n\n"
    file.puts "## Overall Analysis Across All Reward Periods\n\n"
    file.puts overall_meta_summary
    file.puts "\n\n## Individual Reward Period Analyses\n\n"

    all_grant_meta_summaries.each do |summary|
      file.puts "### Period: #{summary[:start_date].strftime("%Y-%m-%d")} to #{summary[:end_date].strftime("%Y-%m-%d")}"
      file.puts "#### Reward ID: #{summary[:grant_id]} (#{summary[:builder_count]} builders analyzed)\n\n"
      file.puts summary[:meta_summary]
      file.puts "\n\n---\n\n"
    end
  end
  puts "Created summary of summaries text file at #{summary_of_summaries_path}"
end

# 11. Write Top Builders CSV
if GENERATE_TOP_BUILDERS
  # Track top builders by profile UUID
  top_builders = Hash.new { |h, k| h[k] = {weekly_rewards: 0, weekly_reward_count: 0, all_time_rewards: 0, all_time_reward_count: 0} }

  # Get IDs of completed final grants
  final_grant_ids = BuilderGrants::Grant
    .where(status: "completed")
    .where(track_type: "final")
    .where(builder_grant_sponsor_id: grant_sponsor.id)
    .pluck(:id)

  puts "Found #{final_grant_ids.size} completed final grants for top builders leaderboard"

  # Process all rewarded users
  all_rewarded_user_ids.each do |user_id_pair|
    grantable_id, grantable_type = user_id_pair
    next unless grantable_type == "Profile"

    # Get the actual profile to access its UUID
    profile = Profile.find_by(id: grantable_id)
    next unless profile # Skip if profile not found

    # Get all rewards for this profile but only from final grants
    profile_rewards = BuilderGrants::User
      .where(grantable_id: grantable_id, grantable_type: "Profile")
      .where(builder_grant_id: final_grant_ids)
      .where("reward_amount > 0")

    # Skip if no rewards found
    next if profile_rewards.empty?

    # Calculate total rewards for this profile
    total_rewards = profile_rewards.sum(:reward_amount)
    reward_count = profile_rewards.count

    # Calculate weekly rewards (past 7 days) but only from final grants
    one_week_ago = Time.now - 7.days
    weekly_rewards = profile_rewards
      .joins(:builder_grant)
      .where("builder_grants.end_date >= ?", one_week_ago)
      .sum(:reward_amount)
    weekly_reward_count = profile_rewards
      .joins(:builder_grant)
      .where("builder_grants.end_date >= ?", one_week_ago)
      .count

    # Update the top builders hash using profile UUID
    top_builders[profile.uuid][:all_time_rewards] = total_rewards
    top_builders[profile.uuid][:all_time_reward_count] = reward_count
    top_builders[profile.uuid][:weekly_rewards] = weekly_rewards
    top_builders[profile.uuid][:weekly_reward_count] = weekly_reward_count
  end

  # Sort and get top 25 builders by all-time rewards
  top_10_builders = top_builders.sort_by { |_, v| -v[:all_time_rewards] }.first(25)

  # Write to CSV
  CSV.open(top_builders_path, "w") do |csv|
    csv << ["Profile UUID", "Earned Rewards this", "This Week's Rewards Total", "All-time Rewards Count", "All-time Rewards Total"]

    top_10_builders.each do |profile_id, data|
      csv << [
        profile_id,
        data[:weekly_reward_count],
        data[:weekly_rewards].round(8),
        data[:all_time_reward_count],
        data[:all_time_rewards].round(8)
      ]
    end
  end

  puts "Created top builders leaderboard CSV at #{top_builders_path}"
end

puts "\nUploading files to filebin.net..."

# Function to upload a file to filebin
def upload_to_filebin(file_path, filebin_id, filename)
  puts "Uploading #{filename}..."

  uri = URI.parse("https://filebin.net/#{filebin_id}/#{filename}")

  file_content = File.read(file_path)

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri.request_uri)
  request.body = file_content

  # Set content type based on file extension
  content_type = case File.extname(filename)
  when ".csv"
    "text/csv"
  when ".txt", ".md"
    "text/plain"
  else
    "application/octet-stream"
  end

  request["Content-Type"] = content_type

  response = http.request(request)

  if response.code.to_i >= 200 && response.code.to_i < 300
    puts "Successfully uploaded #{filename}"
    true
  else
    puts "Failed to upload #{filename}: #{response.code} #{response.message}"
    puts response.body
    false
  end
end

# Upload all files
if GENERATE_ACTIVATION_RATE
  activation_uploaded = upload_to_filebin(activation_rate_path, filebin_id, activation_rate_file)
end

if GENERATE_GROWTH
  growth_uploaded = upload_to_filebin(growth_path, filebin_id, growth_file)
end

if GENERATE_RETENTION
  retention_uploaded = upload_to_filebin(retention_path, filebin_id, retention_file)
end

if GENERATE_DEV_SUMMARIES && all_grants_top_builders.any?
  dev_summaries_uploaded = upload_to_filebin(dev_summaries_path, filebin_id, dev_summaries_file)
end

if GENERATE_TOTALS
  totals_uploaded = upload_to_filebin(totals_path, filebin_id, totals_file)
end

if GENERATE_DAILY_ACTIVITY
  daily_activity_uploaded = upload_to_filebin(daily_activity_path, filebin_id, daily_activity_file)
end

if GENERATE_WEEKLY_ACTIVITY
  weekly_activity_uploaded = upload_to_filebin(weekly_activity_path, filebin_id, weekly_activity_file)
end

if GENERATE_SUMMARY_OF_SUMMARIES
  summary_uploaded = upload_to_filebin(summary_of_summaries_path, filebin_id, summary_of_summaries_file)
end

if GENERATE_DEVELOPER_ACTIVITY
  developer_activity_uploaded = upload_to_filebin(developer_activity_path, filebin_id, developer_activity_file)
end

if GENERATE_ACTIVITY_BY_TYPE
  activity_by_type_uploaded = upload_to_filebin(activity_by_type_path, filebin_id, activity_by_type_file)
end

if GENERATE_REWARDS_BREAKDOWN
  rewards_breakdown_uploaded = upload_to_filebin(rewards_breakdown_path, filebin_id, rewards_breakdown_file)
end

if GENERATE_WINNERS_PROFILE
  winners_profile_uploaded = upload_to_filebin(winners_profile_path, filebin_id, winners_profile_file)
end

if GENERATE_TOP_BUILDERS
  top_builders_uploaded = upload_to_filebin(top_builders_path, filebin_id, top_builders_file)
end

# Check which reports were configured and uploaded successfully
configured_files = []
configured_files << "activation_rate" if GENERATE_ACTIVATION_RATE
configured_files << "growth" if GENERATE_GROWTH
configured_files << "retention" if GENERATE_RETENTION
configured_files << "dev_summaries" if GENERATE_DEV_SUMMARIES && all_grants_top_builders.any?
configured_files << "totals" if GENERATE_TOTALS
configured_files << "summary_of_summaries" if GENERATE_SUMMARY_OF_SUMMARIES
configured_files << "daily_activity" if GENERATE_DAILY_ACTIVITY
configured_files << "weekly_activity" if GENERATE_WEEKLY_ACTIVITY
configured_files << "developer_activity" if GENERATE_DEVELOPER_ACTIVITY
configured_files << "activity_by_type" if GENERATE_ACTIVITY_BY_TYPE
configured_files << "rewards_breakdown" if GENERATE_REWARDS_BREAKDOWN
configured_files << "winners_profile" if GENERATE_WINNERS_PROFILE
configured_files << "top_builders" if GENERATE_TOP_BUILDERS

uploaded_files = []
uploaded_files << "activation_rate" if activation_uploaded
uploaded_files << "growth" if growth_uploaded
uploaded_files << "retention" if retention_uploaded
uploaded_files << "dev_summaries" if dev_summaries_uploaded
uploaded_files << "totals" if totals_uploaded
uploaded_files << "summary_of_summaries" if summary_uploaded
uploaded_files << "daily_activity" if daily_activity_uploaded
uploaded_files << "weekly_activity" if weekly_activity_uploaded
uploaded_files << "developer_activity" if developer_activity_uploaded
uploaded_files << "activity_by_type" if activity_by_type_uploaded
uploaded_files << "rewards_breakdown" if rewards_breakdown_uploaded
uploaded_files << "winners_profile" if winners_profile_uploaded
uploaded_files << "top_builders" if top_builders_uploaded

all_uploads_successful = configured_files.sort == uploaded_files.sort

if all_uploads_successful
  filebin_url = "https://filebin.net/#{filebin_id}"

  puts "\nAll uploads completed successfully!"
  puts "Filebin URL: #{filebin_url}"
  puts "Direct links:"

  if GENERATE_ACTIVATION_RATE
    puts "- Builder Activation Rate: #{filebin_url}/#{activation_rate_file}"
  end

  if GENERATE_GROWTH
    puts "- Growth in Eligible Builders: #{filebin_url}/#{growth_file}"
  end

  if GENERATE_RETENTION
    puts "- Builder Retention: #{filebin_url}/#{retention_file}"
  end

  if GENERATE_DEV_SUMMARIES && all_grants_top_builders.any?
    puts "- Top Builders Summaries (up to 100 per grant): #{filebin_url}/#{dev_summaries_file}"
  end

  if GENERATE_TOTALS
    puts "- Totals Metrics: #{filebin_url}/#{totals_file}"
  end

  if GENERATE_SUMMARY_OF_SUMMARIES
    puts "- Summary of Summaries: #{filebin_url}/#{summary_of_summaries_file}"
  end

  if GENERATE_DAILY_ACTIVITY
    puts "- Daily Builder Activity: #{filebin_url}/#{daily_activity_file}"
  end

  if GENERATE_WEEKLY_ACTIVITY
    puts "- Weekly Builder Activity: #{filebin_url}/#{weekly_activity_file}"
  end

  if GENERATE_DEVELOPER_ACTIVITY
    puts "- Developer Activity: #{filebin_url}/#{developer_activity_file}"
  end

  if GENERATE_ACTIVITY_BY_TYPE
    puts "- Activity by Type: #{filebin_url}/#{activity_by_type_file}"
  end

  if GENERATE_REWARDS_BREAKDOWN
    puts "- Rewards Breakdown: #{filebin_url}/#{rewards_breakdown_file}"
  end

  if GENERATE_WINNERS_PROFILE
    puts "- Winners Profile: #{filebin_url}/#{winners_profile_file}"
  end

  if GENERATE_TOP_BUILDERS
    puts "- Top Builders Leaderboard: #{filebin_url}/#{top_builders_file}"
  end
else
  puts "\nThere were issues with the uploads. Please check the logs above."
  puts "Configured files: #{configured_files.join(", ")}"
  puts "Successfully uploaded files: #{uploaded_files.join(", ")}"
end

