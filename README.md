# NutritionFacts
Alexa AWS Lambda code and Skill walkthrough for gathering and reporting nutritional information

This Skill leverages the [Nutritionix API](https://developer.nutritionix.com/docs/v1_1) to feed nutritional facts back to the user.

The Lambda code is checked in as index.js and can be pasted inline into a Node JS 4.3 function with a basic execution role.

If developing Alexa skills is a new venture, Amazon provides excellent [tutorials](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/alexa-skill-tutorial) for configuring them and linking up with Lambda 

####For the skill portion you'll want to use the following json for the intents:
```javascript
{
  "intents": [
    {
      "intent": "FoodIntent",
      "slots": [
        {
          "name": "Food",
          "type": "LIST_OF_FOOD"
        }
      ]
    },
    {
      "intent": "FoodOnlyIntent",
      "slots": [
        {
          "name": "Food",
          "type": "LIST_OF_FOOD"
        }
      ]
    },
    {
      "intent": "AMAZON.HelpIntent"
    },
    {
      "intent": "AMAZON.StopIntent"
    },
    {
      "intent": "AMAZON.CancelIntent"
    }
  ]
}
```

#### Create a new slot named "LIST_OF_FOOD" and populate it with:

>pizza

>sushi

>churro

>thai coconut curry soup

>chocolate cake

>chocolate ice cream

>pepsi

>coffee

>hamburger

>macaroni and cheese

>ham sandwich

>hot dog

>fries

>donuts

>steak

>cheesecake

>vanilla pudding

>pancakes

>scrambled eggs

>granola

>banana

>chili

>green pepper

>tofu

>orange juice

>pepper jack cheese

>meatballs

Feel free to add to the list!

####Lastly, for sample utterances insert:

>FoodIntent get me {Food}

>FoodIntent what is in {Food}

>FoodIntent how about {Food}

>FoodIntent {Food} please

>FoodOnlyIntent {Food}
