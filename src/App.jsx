import { useState, useEffect } from "react";
import "./App.scss";
import resetIcon from "./assets/close.png";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [incrementingIndex, setIncrementingIndex] = useState(0);
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems ? JSON.parse(savedItems) : [{ name: "Nugget", quantity: 10, id: 100 }];
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const itemName = inputValue.toLowerCase();
  const isFoundItem = items.find(
    (item) => item.name.toLowerCase() === itemName
  );

  const changeQuantity = (name, type) => {
    if (name.length === 0) {
      alert("Please enter an item");
      return;
    }

    if (isFoundItem) {
      if (type === "plus") {
        setItems(
          items.map((item) =>
            item.name.toLowerCase() === itemName
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
      if (type === "minus" && isFoundItem.quantity > 0) {
        setItems(
          items.map((item) =>
            item.name.toLowerCase() === itemName
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    } else {
      if (type === "plus") {
        setItems([...items, { name: name, quantity: 1, id: incrementingIndex }]);
        setIncrementingIndex(incrementingIndex + 1);
      }
    }
  };

  const handleResetInput = () => {
    setInputValue("");
    document.querySelector('.input-wrapper input').focus();
  };

  const handleClickRow = (id) => {
    setInputValue(items.find((item) => item.id === id).name);
  }

  return (
    <div className="App">
      <div className="top">
        <div className="input-wrapper">
          <input
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            value={inputValue}
          />
          <img
            onClick={() => handleResetInput()}
            src={resetIcon}
            className="reset-icon"
            alt="reset"
          />
        </div>
        <div className="button-section">
          <button className="btn" onClick={() => changeQuantity(inputValue, "plus")}>
            PLUS
          </button>
          <button className={`btn ${isFoundItem?'':'disabled'}`} onClick={() => changeQuantity(inputValue, "minus")}>
            MINUS
          </button>
        </div>
      </div>
      <div className="content">
        {items.map((item, index) => (
          <div className="row" onClick={()=>handleClickRow(item.id)} key={index}>
            <p>{item.name}: </p>
            <p>{item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
