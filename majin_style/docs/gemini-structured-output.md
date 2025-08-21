## Gemini は構造化出力を使用

https://ai.google.dev/gemini-api/docs/structured-output?hl=ja#rest

### REST_sample

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
-H "x-goog-api-key: $GEMINI_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
      "contents": [{
        "parts":[
          { "text": "List a few popular cookie recipes, and include the amounts of ingredients." }
        ]
      }],
      "generationConfig": {
        "responseMimeType": "application/json",
        "responseSchema": {
          "type": "ARRAY",
          "items": {
            "type": "OBJECT",
            "properties": {
              "recipeName": { "type": "STRING" },
              "ingredients": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              }
            },
            "propertyOrdering": ["recipeName", "ingredients"]
          }
        }
      }
}' 2> /dev/null | head
```

### output_sample

```
[
  {
    "recipeName": "Chocolate Chip Cookies",
    "ingredients": [
      "1 cup (2 sticks) unsalted butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup packed brown sugar",
      "1 teaspoon vanilla extract",
      "2 large eggs",
      "2 1/4 cups all-purpose flour",
      "1 teaspoon baking soda",
      "1 teaspoon salt",
      "2 cups chocolate chips"
    ]
  },
  ...
]
```
