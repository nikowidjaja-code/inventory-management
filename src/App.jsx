import { useState, useEffect } from "react";
import "./assets/scss/App.scss";
import resetIcon from "./assets/images/close.png";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [incrementingIndex, setIncrementingIndex] = useState(0);
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems
      ? JSON.parse(savedItems)
      : [{ name: "Nugget", quantity: 10, id: 100 }];
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
        if (isFoundItem.quantity === 1) {
          setItems(
            items.filter((item) => item.name.toLowerCase() !== itemName)
          );
          setInputValue("");
        } else {
          setItems(
            items.map((item) =>
              item.name.toLowerCase() === itemName
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        }
      }
    } else {
      if (type === "plus") {
        setItems([
          ...items,
          { name: name, quantity: 1, id: incrementingIndex },
        ]);
        setIncrementingIndex(incrementingIndex + 1);
        setInputValue("");
      }
    }
  };

  const handleResetInput = () => {
    setInputValue("");
    document.querySelector(".input-wrapper input").focus();
  };

  const handleResetItems = () => {
    setItems([]);
    setInputValue("");
  };

  const handleClickRow = (id) => {
    const foundItem = items.find((item) => item.id === id);
    setInputValue(foundItem.name);
  };

  return (
    <div className="App">
      <div className="top">
        <div className="input-wrapper">
          <input
            placeholder="type or tap your item to select"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                changeQuantity(inputValue, "plus");
              }
            }}
            maxLength={20}
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
          <button
            className="btn btn-plus"
            onClick={() => changeQuantity(inputValue, "plus")}
          >
            {isFoundItem ? "Add" : "Create"}
          </button>
          <button
            className={`btn btn-minus ${isFoundItem ? "" : "disabled"}`}
            onClick={() => changeQuantity(inputValue, "minus")}
          >
            {isFoundItem && isFoundItem.quantity <= 1 ? "Delete" : "Subtract"}
          </button>
        </div>
      </div>
      <div className="content">
        {items
          .filter((item) =>
            item.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((item, index) => (
            <div
              className={`row ${
                item.name.toLowerCase() === itemName ? "active" : ""
              }`}
              onClick={() => handleClickRow(item.id)}
              key={index}
            >
              <p>{item.name}</p>
              <p>{item.quantity}</p>
            </div>
          ))}
      </div>
      <div className="floating-section">
        <div onClick={() => handleResetItems()} className="floating-section-item">
          <p>Reset</p>
        </div>
      </div>
    </div>
  );
}

export default App;
