import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Modal, Box, Button, Typography } from '@mui/material';

const API_URL = "https://dummyjson.com/recipes";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [meals, setMeals] = useState([]);
  const [weekMeals, setWeekMeals] = useState({
    week1: [],
    week2: [],
    week3: [],
    week4: [],
  });
  const [selectedWeek, setSelectedWeek] = useState('week1');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setMeals(response.data.recipes);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleOpen = (meal) => {
    setSelectedMeal(meal);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddMealToWeek = (week) => {
    if (!weekMeals[week].includes(selectedMeal)) {
      setWeekMeals(prevState => ({
        ...prevState,
        [week]: [...prevState[week], selectedMeal]
      }));
    }
    handleClose();
  };

  const removeMealFromWeek = (meal) => {
    setWeekMeals(prevState => ({
      ...prevState,
      [selectedWeek]: prevState[selectedWeek].filter(m => m.id !== meal.id)
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Strugbits-Optimized Your Meal</h1>
        <p>Select Meal to Add in Week. You will be able to edit, modify and change the Meal Weeks.</p>
      </header>
      <div className="tabs">
        <button onClick={() => setSelectedWeek('all')}>All Meals</button>
        <button onClick={() => setSelectedWeek('week1')}>Week 1</button>
        <button onClick={() => setSelectedWeek('week2')}>Week 2</button>
        <button onClick={() => setSelectedWeek('week3')}>Week 3</button>
        <button onClick={() => setSelectedWeek('week4')}>Week 4</button>
      </div>
      <div className="meal-container">
        {(selectedWeek === 'all' ? meals : weekMeals[selectedWeek]).map(meal => (
          <div key={meal.id} className="meal-card">
            <img src={meal.image} alt={meal.name} />
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            {selectedWeek !== 'all' && (
              <button onClick={() => removeMealFromWeek(meal)}>Remove from Week</button>
            )}
            {selectedWeek === 'all' && (
              <button onClick={() => handleOpen(meal)}>Add to Week</button>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select Week
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Select the week to add the meal to:
          </Typography>
          <Button onClick={() => handleAddMealToWeek('week1')}>Week 1</Button>
          <Button onClick={() => handleAddMealToWeek('week2')}>Week 2</Button>
          <Button onClick={() => handleAddMealToWeek('week3')}>Week 3</Button>
          <Button onClick={() => handleAddMealToWeek('week4')}>Week 4</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
