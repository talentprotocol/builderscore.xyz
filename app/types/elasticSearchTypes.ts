interface ESTermQuery {
  term: Record<string, string | number | boolean>;
}

interface ESRangeValue {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
}

interface ESRangeQuery {
  range: Record<string, ESRangeValue>;
}

interface ESBoolQuery {
  bool: {
    must?: ESQueryClause[];
    should?: ESQueryClause[];
    must_not?: ESQueryClause[];
    filter?: ESQueryClause[];
  };
}

interface ESNestedQuery {
  nested: {
    path: string;
    query: ESBoolQuery;
  };
}

type ESQueryClause = ESTermQuery | ESRangeQuery | ESBoolQuery | ESNestedQuery;
