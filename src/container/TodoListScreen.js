import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Spinner from 'react-native-spinkit';
import database, { firebase } from '@react-native-firebase/database';
import FirebaseDBConfig from '../config'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { connect } from 'react-redux';
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons';

const FULL_DATE_TIME_FORMAT = 'HH:mm D/MM/YY'

const styles = StyleSheet.create({
    fullScreen: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textNavBar: {
        fontSize: 16,
        color: 'white',
        backgroundColor: '#3375de',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
    cell: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 5
    }
})

const COLLECTION = 'Todos/'

class TodoListScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            data: [],
            loading: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && !_.eq(nextProps.data, this.props.data)) {
            const data = nextProps.data;
            this.addNewItem(data.action, data.detail, data.endTime)
            return
        }

        if (nextProps.editData && !_.eq(nextProps.editData, this.props.editData)) {
            const data = nextProps.editData;
            this.update(data)
        }
    }

    componentDidMount() {
        if (!firebase.apps.length) {
            firebase.initializeApp(FirebaseDBConfig);
        }
        firebase.database().setPersistenceEnabled(true);

        this.fetchData();
    }

    addNewItem = (action, detail, endTime, createdTime = new Date().getTime()) => {
        database().ref(COLLECTION + createdTime)
            .set({
                action,
                detail,
                endTime,
                createdTime
            }).then((data) => {
                //success callback
                console.log('data ', data)
                this.fetchData();
            }).catch((error) => {
                //error callback
                console.log('error ', error)
            })
    }

    fetchData = () => {
        database()
            .ref(COLLECTION)
            .once('value')
            .then(snapshot => {
                var items = snapshot.val();
                items = Object.keys(items).map(function (key) {
                    let item = items[key];
                    item.id = key;
                    return item;
                });
                console.log('data ', snapshot)
                this.setState({ data: items, loading: false })
            })
            .catch(err => {
                this.setState({ loading: false })
            });
    }

    delete = (item) => {
        let { data } = this.state;
        data = _.remove(data, (i) => item.id !== i.id);
        this.setState({ data })
        database().ref(COLLECTION + item.id).remove()
    }

    update = (data) => {
        database().ref(COLLECTION + data.id).update({
            ...data
        });
    }

    render() {
        let { data, loading } = this.state;
        if (loading) {
            return (
                <View style={styles.fullScreen}>
                    <Spinner style={{ alignSelf: 'center', }} size={50} type={'ThreeBounce'} color={'rgba(30, 160, 208, 1)'} />
                    <Text>Initializing app...</Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.textNavBar}>{'MY TO DO LIST'}</Text>
                <View style={{ flexDirection: 'row', marginVertical: 5, paddingHorizontal: 5 }}>
                    <Text style={[styles.textTitle, { flex: 1 }]}>Action</Text>
                    <Text style={[styles.textTitle, { flex: 1 }]}>Detail</Text>
                    <Text style={[styles.textTitle, { flex: 1 }]}>End Time</Text>
                    <Text style={[styles.textTitle, { flex: 1 }]}>Remaining Time</Text>
                    <Text style={[styles.textTitle, { flex: 0.5 }]}>Action</Text>
                </View>
                <View style={{ width: '100%', height: 0.5, backgroundColor: '#b1b3b5', paddingHorizontal: 5 }} />
                <FlatList
                    ref={ref => this.flatList = ref}
                    renderItem={this.renderCell}
                    data={data}
                    keyExtractor={this.keyExtractor}
                    style={{ backgroundColor: 'white' }}
                />
                <View style={{ width: '50%', padding: 10, alignSelf: 'center' }}>
                    <Button style={{ borderRadius: 10 }} title='Add Todo' onPress={() => Actions.addTodo()} />
                </View>
            </View >
        )
    }

    keyExtractor = (item, index) => {
        return index.toString();
    }

    renderCell = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.cell}
                onPress={() => Actions.addTodo({ item })}
            >
                <Text style={{ flex: 1 }}>{item.action}</Text>
                <Text style={{ flex: 1 }}>{item.detail}</Text>
                <Text style={{ flex: 1 }}>{this.getDateTime(item.endTime)}</Text>
                <Text style={{ flex: 1 }}>{
                    this.getRemainingTime(item.endTime)
                }</Text>
                <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.delete(item)}>
                    <Icon name='delete' size={25} color='#b1b3b5' />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    getDateTime = (time) => {
        if (!time) {
            return 'N/A';
        }
        let dateTime = new Date(time);
        return moment(dateTime).format(FULL_DATE_TIME_FORMAT);
    }

    getRemainingTime = (time) => {
        if (!time) {
            return 'Expired Task'
        }
        const currentDate = moment();
        const future = moment(time);
        return moment(future).fromNow();
    }
}

const mapStateToProps = state => ({
    data: state.appState.data,
    editData: state.appState.editData
})

// Any actions to map to the component?
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoListScreen);

