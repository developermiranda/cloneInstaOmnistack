import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../services/api';

import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={ camera } />
      </TouchableOpacity>  
    ),
  });

  state = {
    feed:[],
  };

  async componentDidMount(){
    this.resgisterToSocket();
    const response = await api.get('posts');

    console.log(response.data);
    
    this.setState({ feed: response.data })  ;
}

resgisterToSocket = () => {
  const socket = io('http://192.168.2.113:3333');

  socket.on('post', newPost => {
      this.setState({feed: [newPost, ... this.state.feed] });
  })

  socket.on('like', likedPost => {
      this.setState({
          feed: this.state.feed.map(post =>
              post._id === likedPost._id ? likedPost: post
          )
      });
  })
}

handleLike = id => {
  api.post(`/posts/${id}/like`);
}

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
           
           <View style={styles.feedItem}>
              
              <View style={styles.feedItemHeader}>
                
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>

                <Image source={more}/>
              </View>

              <Image style={styles.feedImage} source={{ uri: `http://192.168.2.113:3333/files/${item.image}` }} />

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => this.handleLike(item._id)}>
                    <Image source={like} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Image source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Image source={send} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.likes}>{item.likes} curtidas </Text>
                <Text style={styles.description}>{item.description} </Text>
                <Text style={styles.hashtags}>{item.hashtags} </Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },

  feedItem: {
    marginTop: 20
  },

  feedItemHeader: {
    paddingHorizontal: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 14,
    color: '#000'
  },

  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },

  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },

  feedItemFooter: {
    paddingHorizontal: 15,
  },

  actions: {
    flexDirection: 'row'
  },

  //Parei aqui
  //actions




});

