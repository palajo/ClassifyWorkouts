import React, { useEffect } from 'react';
import $ from 'jquery';

import '../styles/styles.scss';
import Api from '../api/Api';

function MainPage(props) {
  const api = Api;

  const something = (exercise, index) => {

    // creating list of exercises
    let exercises = [];
    for (let i = 1; i < exercise.sets_number + 1; i++) {
      exercises.push(
        <div data-set={`set-${i}`} data-done="false">
          <div>
            {exercise.name} – {i}
          </div>
          <button className="next-exercise">
            next
          </button>
        </div>
      )
    }

    return exercises;
  };

  useEffect(() => {
    $(document).ready(function() {
      // current
      let currentExercise = 1;
      let currentSet = 1;

      $('.workouts').find(`section[data-exercise="exercise-${currentExercise}"]`).addClass('active-exercise');
      $('.workouts').find(`section[data-exercise="exercise-${currentExercise}"] > div[data-set="set-${currentSet}"]`).addClass('active-set');

      // next exercise switcher
      $('.next-exercise').click(function() {
        $(this).closest('div').attr('data-done', 'true');

        // check for set or super/tri/giant-set
        if ($(this).closest('section').hasClass('set')) {

          let sets = $(this).closest('section').children('div').length.toString();
          let doneSets = $(this).closest('section').find('div[data-done="true"]').length.toString();

          currentSet = currentSet + 1;

          if (sets === doneSets) {
            currentExercise = currentExercise + 1;
            currentSet = 1;

            $(this).closest('section').attr('data-set-done', 'true');
          }

        } else {
          let setId = $(this).closest('section').attr('data-set-id').toString();
          let sets = $(this).closest('.workouts').find(`section[data-set-id="${setId}"] > div`).length;
          let doneSets = $(this).closest('.workouts').find(`section[data-set-id="${setId}"] > div[data-done="true"]`).length;

          if (sets === doneSets) {
            currentExercise = currentExercise + 1;
            currentSet = 1;

            $(`section[data-set-id="${setId}"]`).attr('data-set-done', 'true');

          } else {
            let setsInSuperset = $(this).closest('.workouts').find(`section[data-set-id="${setId}"]`).find(`div[data-set="set-${currentSet}"]`).length;
            let setsDoneInSuperset = $(this).closest('.workouts').find(`section[data-set-id="${setId}"]`).find(`div[data-set="set-${currentSet}"][data-done="true"]`).length;
            let lengthOfSet = $(this).closest('.workouts').find(`section[data-set-id="${setId}"]`).length;
            let closestSectionIndex = $(this).closest('section').index() + 1;

            if (setsInSuperset === setsDoneInSuperset) {
              currentSet = currentSet + 1;
              currentExercise = closestSectionIndex - (lengthOfSet - 1);
            } else {
              currentExercise = currentExercise + 1;
            }

          }
        }

        // reset active exercise and set
        $('.workouts').find('section').removeClass('active-exercise');
        $('.workouts').find('section > div[data-set]').removeClass('active-set');

        $('.workouts').find(`section[data-exercise="exercise-${currentExercise}"]`).addClass('active-exercise');
        $('.workouts').find(`section[data-exercise="exercise-${currentExercise}"] > div[data-set="set-${currentSet}"]`).addClass('active-set');
      })
    });
  }, []);

  return (
    <div className="workouts">
      {
        api.map((result, index) => (
          <>
            {
              // change warm_up with cool_down or workout to map those objects
              result.result.warm_up.elements.map((exercise, index) => (
                <section
                  data-exercise={`exercise-${index + 1}`}
                  data-set={exercise.group_type}
                  data-set-id={exercise.group_id}
                  data-sets-number={exercise.sets_number}
                  data-set-done="false"

                  key={exercise.element_id}
                  className={exercise.group_type}
                  style={{ marginBottom: '30px' }}
                >
                  {something(exercise, index)}
                </section>
              ))
            }
          </>
        ))
      }
    </div>
  );
}

export default MainPage;