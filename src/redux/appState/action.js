

export function addTodo(something) {
    return async (dispatch) => {
        return dispatch({
            type: 'ADD',
            data: something,
        });
    };
}

export function editTodo(something) {
    return async (dispatch) => {
        return dispatch({
            type: 'EDIT',
            data: something,
        });
    };
}