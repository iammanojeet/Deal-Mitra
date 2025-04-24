import React from "react";
import "../../styles/RecipePage.scss";

const RecipePage = ({ ingredients, recipeName }) => {
  return (
    <div classname="homepage">
      <h2>Welcome to the Food Recipe Site</h2>
      <p>Discover and share recipes from around the world!</p>

      {recipeName && <h3>Recipe: {recipeName}</h3>}

      {ingredients.length > 0 && (
        <div>
          <h4>Ingredients:</h4>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>
                {item.name}: {item.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
