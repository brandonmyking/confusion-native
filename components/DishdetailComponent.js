import React from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, Modal, Button, Alert, PanResponder} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish (props) {
    const dish = props.dish;

    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        if (dx < -200)
            return true;
        else   
            return false;
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)) 
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel pressed')
                        },
                        {
                            text: 'Ok',
                            onPress: () => props.favorite ? console.log('Already a favorite') : props.onPress()

                        }
                    ],
                    {cancelable: false}
                )
            return true;
        }
    });

    if(dish != null) {
        return(
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000} {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}
                    >
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon 
                            type='font-awesome' 
                            raised 
                            reverse 
                            name={props.favorite ? 'heart' : 'heart-o'}
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already a favorite') : props.onPress()}
                            >
                        </Icon>
                        <Icon
                            style={styles.cardItem}
                            type='font-awesome'
                            raised
                            reverse
                            name='pencil'
                            color='#512DA8'
                            onPress={() => props.onShowModal()}
                        >
                        </Icon>
                    </View>
                    
                        
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>)
    }
}

function RenderComments (props) {
    const {comments} = props;

    const renderCommentItem = ({item, index}) => {
        return(
           <View key={index} style={{margin: 5, alignItems: 'flex-start'}}>
                <Text style={{fontSize: 14, paddingVertical: 5}}>{item.comment}</Text>
                <Rating readonly startingValue={+item.rating} imageSize={14} style={{paddingVertical: 5}} />
                <Text style={{fontSize: 12, paddingVertical: 5}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    }

    return(
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class DishDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            comment: ''
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            comment: ''
        });
    }

    handleComment(dishId, rating, author, comment) {
        this.props.postComment(dishId, rating, author, comment);
        this.toggleModal();

    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} onPress={() => this.markFavorite(dishId)} favorite={this.props.favorites.some(el => el === dishId)} onShowModal={() => this.toggleModal()} />
                <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                        <View style={styles.modal}>
                            <Rating
                                showRating
                                startingValue={this.state.rating}
                                onFinishRating={(rating)=>this.setState({rating: rating})}
                                imageSize={25}
                            />
                            <Input
                                placeholder="Author"
                                leftIcon={{type: 'font-awesome', name: 'user-o'}}
                                leftIconContainerStyle={{marginRight: 10}}
                                onChangeText={(value) => this.setState({author: value})}
                            />
                            <Input
                                placeholder="Comment"
                                leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                                leftIconContainerStyle={{marginRight: 10}}
                                onChangeText={(value) => this.setState({comment: value})}
                            />
                            <Button 
                                onPress={() => {this.resetForm(); this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment)}}
                                color='#512DA8'
                                title='Submit'
                            />
                            <Button 
                                onPress={() => {this.toggleModal(); this.resetForm();}}
                                color='#BBB'
                                title='Cancel'
                            />
                        </View>
                </Modal>
            </ScrollView>
        
        );
    }
    
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 30
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);