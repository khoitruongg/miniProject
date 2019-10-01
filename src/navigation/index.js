import React from "react";
import {
    Actions,
    Scene,
    ActionConst,
    Stack,
    Lightbox,
    Overlay,
    Modal
} from "react-native-router-flux";
import { TodoListScreen, AddTodoScreen } from '@container'

export default Actions.create(
    <Overlay>
        <Modal key='modal' hideNavBar>
            <Lightbox key='lightbox'>
                <Stack key='root' hideNavBar >
                    <Scene key='todoList' component={TodoListScreen} initial />
                    <Scene key='addTodo' component={AddTodoScreen} />
                </Stack>
            </Lightbox>
        </Modal>
    </Overlay>
)