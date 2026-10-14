import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Stage from './Stage';

const PipelineListBox = ({
  allPipeline,
  changePipeline,
  job_id,
  loadingPipeline,
}) => {
  const [columns, setColumns] = useState(allPipeline);

  useEffect(() => {
    setColumns(allPipeline);
  }, [allPipeline]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.applicants];
      const destItems = [...destColumn.applicants];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const columnsCopy = Array.from(columns);

      columnsCopy[source.droppableId].applicants.splice(
        0,
        columnsCopy[source.droppableId].count,
        ...sourceItems,
      );
      --columnsCopy[source.droppableId].count;
      columnsCopy[destination.droppableId].applicants.splice(
        0,
        columnsCopy[destination.droppableId].count,
        ...destItems,
      );
      ++columnsCopy[destination.droppableId].count;
      setColumns(columnsCopy);

      changePipeline({
        pipeline_id: destColumn?.id,
        applicants_id: [removed.id],
        job_id,
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.applicants];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div>
        <div
          className={`pipeline-list-box ${loadingPipeline ? 'ej-loading' : ''}`}
        >
          {columns?.map((pipeline, index) => {
            return (
              <Droppable key={pipeline?.id} droppableId={index.toString()}>
                {(provided, snapshot) => (
                  <div
                    className={`pipeline__board ${
                      pipeline?.type == 99 && 'selected'
                    } ${pipeline?.type == 100 && 'rejected'}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="pipeline__board--title">
                      <h5>{pipeline?.label}</h5>
                      <span className="candidates-number">
                        {pipeline?.count}
                      </span>
                    </div>
                    <ul
                      className="pipeline__board--content"
                      id={`pipeline-${pipeline?.id}`}
                      data-pipeline-id={pipeline?.id}
                    >
                      {pipeline?.count > 0 ? (
                        <>
                          {pipeline?.applicants?.map((applicant, ind) => (
                            <Stage
                              key={applicant}
                              applicant={applicant}
                              index={ind}
                            />
                          ))}
                        </>
                      ) : (
                        <li class="pipeline-card-not-found">
                          <p> No candidates found. </p>
                        </li>
                      )}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default PipelineListBox;
