import React, { Component } from 'react';
import { View, Text, Button, TextInput, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { connect } from 'react-redux';
import * as AppStateActions from '@redux/appState/action'
import DatePicker from 'react-native-date-picker';

const styles = StyleSheet.create({
    titleNavBar: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    editText: {
        color: '#434543',
        borderRadius: 5,
        borderColor: '#636161',
        borderWidth: 0.6,
        margin: 5
    }
})

class AddTodoScreen extends Component {
    constructor(props) {
        super(props);
        this.editMode = !_.isEmpty(props.item)
        this.state = {
            result: this.editMode ? props.item : {},
            disabledButton: this.editMode ? false : true,
            date: this.editMode ? props.item.endTime : new Date()
        };
    }

    onActionTextChange = (text) => {
        let { result } = this.state;
        result.action = text;
        this.setState({ result }, () => this.checkEnableButton())
    }

    onDetailTextChange = (text) => {
        let { result } = this.state;
        result.detail = text;

        this.setState({ result }, () => this.checkEnableButton())
    }

    checkEnableButton = () => {
        let { result } = this.state;
        let enable = !_.isEmpty(result.action) && !_.isEmpty(result.detail)
        this.setState({ disabledButton: !enable })
    }

    render() {
        let { result, disabledButton, date } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#3375de', alignItems: 'center' }}>
                    <Icon.Button name='arrow-back' size={25} color='white' backgroundColor='#3375de' onPress={() => Actions.pop()} />
                    <Text style={styles.titleNavBar}>{this.editMode ? 'Edit Task' : 'Add Task'}</Text>
                </View>
                <View>
                    <TextInput
                        style={styles.editText}
                        placeholder='Input action'
                        onChangeText={this.onActionTextChange}
                        value={result.action} />

                    <TextInput
                        style={styles.editText}
                        placeholder='Input detail'
                        onChangeText={this.onDetailTextChange}
                        value={result.detail} />

                    <Text style={{ marginVertical: 5, alignSelf: 'center', fontWeight: 'bold' }}>Choose end time</Text>
                    
                    <DatePicker
                        style={{ marginVertical: 5 }}
                        date={date}
                        mode='datetime'
                        onDateChange={(date) => this.setState({ date })} />

                    <View style={{ margin: 5 }}>
                        <Button
                            disabled={disabledButton}
                            title='Add'
                            style={{ borderRadius: 10 }}
                            color='#2cd43d'
                            onPress={() => {
                                result.endTime = new Date(date).getTime();
                                this.editMode ? this.props.edit(result) : this.props.add(result)

                                Actions.pop()
                            }
                            } />
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    data: state.appState.data,
})

// Any actions to map to the component?
const mapDispatchToProps = {
    add: AppStateActions.addTodo,
    edit: AppStateActions.editTodo
}

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(AddTodoScreen);

