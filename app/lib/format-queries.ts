import { RuleGroupType } from "react-querybuilder";

export function formatQuery(query: RuleGroupType) {
  const result: { field: string; operator: string; value: unknown }[] = [];

  const processRules = (ruleGroup: RuleGroupType) => {
    ruleGroup.rules.forEach((item) => {
      if ("field" in item) {
        result.push({
          field: item.field,
          operator: item.operator,
          value: item.value,
        });
      } else {
        processRules(item);
      }
    });
  };

  processRules(query);
  return result;
}
