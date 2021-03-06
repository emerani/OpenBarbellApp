import {
    UPDATE_EXERCISE_SUGGESTIONS_MODEL,
    UPDATE_TAG_SUGGESTIONS_MODEL
} from 'app/ActionTypes';

const SuggestionsReducer = (state = createDefaultState(), action) => {
    switch (action.type) {
        case UPDATE_EXERCISE_SUGGESTIONS_MODEL:
            return Object.assign({}, state, {exerciseModel: generateAutocompleteExerciseModel(action.historyData)});
        case UPDATE_TAG_SUGGESTIONS_MODEL:
            return Object.assign({}, state, {tagsModel: generateAutocompleteTagsModel(action.historyData)});
        default:
            return state;
    }
};

const createDefaultState = () => ({
    exerciseModel: {
        'squat' : {suggestion: 'Squat', seed: 100},
        'bench': {suggestion: 'Bench', seed: 100},
        'deadlift': {suggestion: 'Deadlift', seed: 100},
        'sumo deadlift' : {suggestion: 'Sumo Deadlift', seed: 3},
        'back squat' : {suggestion: 'Back Squat', seed: 2},
        'front squat' : {suggestion: 'Front Squat', seed: 2},
    },
    tagsModel: {
        'belt' : {suggestion: 'Belt', seed: 100},
        'high bar' : {suggestion: 'High Bar', seed: 100},
    }
});

const generateAutocompleteExerciseModel = (historyData) => {
    // declare vars
    let dictionary = createDefaultState().exerciseModel;
    let model = createDefaultState().exerciseModel;
    let sets = dictToArray(historyData);

    // ignore nulls
    sets = sets.filter((set) => set.exercise !== null);

    // generate dictionary with counts
    sets.map((set) => {
        let lowercaseExercise = set.exercise.toLowerCase();
        if (dictionary[lowercaseExercise] === undefined) {
            dictionary[lowercaseExercise] = { suggestion: set.exercise, seed: 1 };
        } else {
            dictionary[lowercaseExercise] = { suggestion: set.exercise, seed: dictionary[lowercaseExercise].seed + 1};
        }
    });

    // ignore anything less than 2 count
    for (var property in dictionary) {
        if (dictionary.hasOwnProperty(property) && dictionary[property].seed > 1) {
            model[property] = dictionary[property];
        }
    }
    
    // return
    return model;
};

const generateAutocompleteTagsModel = (historyData) => {
    // declare vars
    let model = createDefaultState().tagsModel;
    let sets = dictToArray(historyData);

    // ignore undefined / nulls / empties
    sets = sets.filter((set) => set.tags !== undefined && set.tags !== null && set.tags.length > 0);

    // generate dictionary with counts
    sets.map((set) => {
        set.tags.map((tag) => {
            let lowercaseTag = tag.toLowerCase();
            if (model[lowercaseTag] === undefined) {
                model[lowercaseTag] = { suggestion: tag, seed: 1 };
            } else {
                model[lowercaseTag] = { suggestion: tag, seed: model[lowercaseTag].seed + 1};
            }
        });
    });
    
    // return
    return model;
};

// TODO: consider moving this to a utility class as logic is duplicated from Set Selectors
const dictToArray = (dictionary) => {
    var array = [];
    for (var property in dictionary) {
        if (dictionary.hasOwnProperty(property)) {
            array.push(dictionary[property]);
        }
    }
    return array;
};

export default SuggestionsReducer;