import { useState, useEffect, useRef } from 'react';
import SinglyLinkedList from './LinkedList';

import PixiImage from '../assets/pixi.png';

let list = new SinglyLinkedList();

function TaskManager() {
  const [item, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [add, setAdd] = useState(false);

  let focus = useRef(null);

  // get stored localStorage values
  useEffect(() => {
    const storedItems = localStorage.getItem('todo');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // re-render whenever new item added
  useEffect(() => {
    let print = list.print();
    setItems(print);
  }, [add]);

  // save to localStorage whenever item array changes
  useEffect(() => {
    localStorage.setItem('todo', JSON.stringify(item));
  }, [item]);

  // Function to add a new task
  const addTask = () => {
    if (!inputValue.trim()) {
      setInputValue('');
      return;
    }

    list.push(inputValue.replace(/\s+/g, ' '));
    setInputValue('');
    setAdd((prev) => !prev);
    focus.current.focus();
  };

  // Function to delete a task
  const deleteTask = (index) => {
    list.remove(index);
    setAdd((prev) => !prev);
  };

  // Function to up a task
  const upTask = (index, task) => {
    if (index === 0) return;

    list.insert(index - 1, task);
    list.remove(index + 1);
    setAdd((prev) => !prev);
  };

  // Function to down a task
  const downTask = (index, task) => {
    if (index === item.length - 1) return;

    list.insert(index + 2, task);
    list.remove(index);
    setAdd((prev) => !prev);
  };

  return (
    <div className='main'>
      <div className='text'>
        <img className='pixi' src={PixiImage} alt='pixi' />
        <h1>Task Manager</h1>
        <p>Made Using Singly Linked List</p>
      </div>
      <div className='inputBox'>
        <textarea
          type='text'
          placeholder='Ajust input height according to your preference'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={focus}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul
        style={{
          backgroundColor: item.length > 0 ? '' : 'transparent',
        }}
      >
        {item.length > 0 ? (
          <li className='grid-container'>
            <h4>Status</h4>
            <h4>Description</h4>
            <h4>Priority</h4>
            <h4>Delete</h4>
          </li>
        ) : (
          <h2 style={{ textAlign: 'center' }}>Add Your Tasks For Today</h2>
        )}

        {item &&
          item.map((task, index) => (
            <li key={index} className='grid-container'>
              <input type='checkbox' />
              <h4>{task}</h4>

              <div className='priority'>
                <i
                  onClick={() => upTask(index, task)}
                  className='fa-solid fa-arrow-up'
                />
                <i
                  onClick={() => downTask(index, task)}
                  className='fa-solid fa-arrow-down'
                />
              </div>
              <i
                onClick={() => deleteTask(index)}
                className='fa-solid fa-trash-can'
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default TaskManager;
