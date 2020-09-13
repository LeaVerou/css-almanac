#standardSQL
# 10_05: structured data by @type
CREATE TEMPORARY FUNCTION getCssInJS(payload STRING)
RETURNS ARRAY<STRING> LANGUAGE js AS '''
  try {
    var $ = JSON.parse(payload);
    var css = JSON.parse($._css);

    return [css.css_in_js]
  } catch (e) {
    return [e.message];
  }
''';

SELECT getCssInJS(payload) FROM `httparchive.sample_data.pages_mobile_10k`