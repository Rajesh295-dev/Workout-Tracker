const router = require('express').Router();
const { Workout } = require('../../models');

//Retrieve all workouts
router.get('/', (req, res) =>
  Workout.find({})
    .sort({ date: -1 })
    .then((dbWorkout) => res.json(dbWorkout))
    .catch((err) => res.status(400).json(err))
);


//Create workout
router.post('/', ({ body }, res) =>
  Workout.create(body)
    .then((dbWorkout) => res.json(dbWorkout))
    .catch((err) => res.status(400).json(err))
);

//Add new exercise to workout
router.put('/:_id', ({ params, body }, res) =>
  Workout.findOneAndUpdate(
    { _id: params._id },
    { $push: { exercises: body } },
    { upsert: true, useFindandModify: false }
  )
    .then((dbWorkout) => res.json(dbWorkout))
    .catch((err) => res.status(400).json(err))
);

//set duration to selected workout
router.get('/range', (req, res) =>
  Workout.aggregate(
    [
      {
        $addFields: {
          totalDuration: {
            $sum: '$exercises.duration',
          },
          combinedWeight: {
            $sum: '$exercises.weight',
          },
        },
      },
    ],
    (err, data) => (err ? res.send(err) : res.json(data))
  )
);

module.exports = router;