
## Team members:
* Meishan Dong
* Zephyr Zhou
* Joely Swartz
* Christina Zhang
* Yueqian Zhang

## Project title:  Knock on the Happiness Door 

## Project page: https://cse442-20f.github.io/FP-Knock-On-The-Happiness-Door/

## Project description:

What makes a country happy? We started this project to explore this question. We want to help citizens of any country understand what contributes to the overall well-being of people, help policy makers to learn about their country’s happiness score and compare with other countries to determine which policies can be enacted to help their citizens, and help potential immigrants to search for new countries to live in. 

What do people need to pay attention to in order to live happier? What policy does the policy maker need to do to create a happy country? Where is the happiest country to live?

We analyzed the happiness data from the Gallup World Poll covering 155 countries between 2015 and 2019 to find out these answers.

### Data Source:
https://www.kaggle.com/unsdsn/world-happiness

### Team member’s individual contributions:

- Data finding, Data wrangling: Joely Swartz 
- Demo video: Meishan Dong, Zephyr Zhou, Joely Swartz, Christina Zhang, Yueqian Zhang
- Visualizations implementations:
  - HTML, CSS:  Zephyr Zhou, Yueqian Zhang
  - Geo mapping and searching function:  Christina Zhang
  - Happiness trend in different countries through 2015 - 2019 & rank table: Yueqian Zhang 
  - Important factors that contributes to the happiness of a country: Zephyr Zhou,Meishan Dong 
  - Write ups: Joely Swartz
  - Final delivery: Meishan Dong, Zephyr Zhou, Joely Swartz, Christina Zhang, Yueqian Zhang

## File Structure
- ./src original source code, html, css, js
- ./docs builded source code
- ./static csv data files
- package.json run build test scripts and packages

## Design Choice
When designing “Important factors that contribute to the happiness of a country“, we originally wanted to use the pie chart to show the key factors of making happiness, but according to the ranking of angles in visual encoding, pie chart is actually not an efficient choice for visualization. Position, on the other hand, is alway the best visual encoding. The spider chart shows the data point as a different position on the factor axises. We are able to see obvious comparisons from different factors that matter from a happy score. For example, it is very obvious that the higher the happy score, the other important factors of making happiness also higher.

# Note
1. docs repo should remain empty untill we build and deploy the project in the end
2. Let's discuss before push to master branch.
Else,
You can save your work on different branch by
```
git checkout -b your_name/your_branch_name
```
then push your change by
```
git push origin your_name/your_branch_name
```
Then we can all see updates on your branch


# Edit
1. edit src/index.html and src/style.css
2. put any index.js in src
3. put any datasource, images, other assets in static folder

# Test
1. install all dependencies and this will create node module at root directory
```
npm install
```
2. test, opens portal host:1234 by
```
npm start
```
