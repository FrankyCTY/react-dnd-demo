import React, { useState } from 'react';
import './App.css';
import initialData from './initial-data';
import { Column } from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

function App() {
  const [initData, setInitData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // position not changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startCol = initData.columns[source.droppableId];
    const finishCol = initData.columns[destination.droppableId];

    // If it's the same Column
    if (startCol === finishCol) {
      const newTaskIds = Array.from(finishCol.taskIds);
      // remove source item
      newTaskIds.splice(source.index, 1);
      // add item to destination
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...finishCol,
        taskIds: newTaskIds,
      };

      const newState = {
        ...initData,
        columns: {
          ...initData.columns,
          [newColumn.id]: newColumn,
        },
      };

      setInitData(newState);
      return;
    }

    // Different columns
    // Moving from one list to another
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...startCol,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishCol = {
      ...finishCol,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...initData,
      columns: {
        ...initData.columns,
        [newStartCol.id]: newStartCol,
        [newFinishCol.id]: newFinishCol,
      },
    };
    setInitData(newState);
  };

  const onDragStart = (start, provided) => {
    provided.announce(
      `You have lifted the task in position ${start.source.index + 1}`
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {initData.columnOrder.map((columnId) => {
        const column = initData.columns[columnId];
        const tasks = column.taskIds.map((taskId) => initData.tasks[taskId]);

        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
}

export default App;
