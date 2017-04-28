/**
 * By Daniel Estiven Rico Posada
 * danielrico.posada@gmail.com
 */

'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/*----------------------------------
  Eventos de calificación 
------------------------------------*/

exports.sendQualificationNotificationCorus = functions.database.ref('/user-posts/{postId}/{result}').onWrite(event =>{
	const postId = event.params.postId;

	console.log("PostId: "+postId);
	console.log("Event Data" + event.data.val());

  if (!event.data.val()) {
    return console.log('PostId '+postId);
  }

  console.log('Se ha calificado el post ', postId);

  return admin.database().ref('/user-posts/'+postId).once('value').then(snapshot => {
     if (!snapshot.exists()) {
          console.log('Post not found:', postId);
          return;
      }
      const tokensSnapshot = snapshot.child('notificationTokens');
      if (!tokensSnapshot.exists()) {
          console.log('No tokens for Post: ', postId);
          return;
      }

      // Notification details.
      const payload = {
        'data': 
            {
              'title': "Nueva Calificación",
              'body':'La publicación que has realizado ha sido revisada por nuestros profesionales,la tienes disponible en tus items',
              'type':'Qualification'
            }
      };

      const tokens = Object.keys(tokensSnapshot.val());
      console.log(tokens);

      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload).then(response => {
        // For each message check if there was an error.
        console.log("Successfully sent message:", response);

        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
          }else{
            console.log("Notificación enviada con exito");
          }
        });
        return Promise.all(tokensToRemove);
    });
  });
});

exports.sendQualificationNotificationCocono = functions.database.ref('/user-posts-reflexive/{postId}/{result}').onWrite(event =>{
  const postId = event.params.postId;

  console.log("PostId: "+postId);
  console.log("Event Data" + event.data.val());

  if (!event.data.val()) {
    return console.log('PostId '+postId);
  }

  console.log('Se ha calificado el post ', postId);

  return admin.database().ref('/user-posts-reflexive/'+postId).once('value').then(snapshot => {
     if (!snapshot.exists()) {
          console.log('Post not found:', postId);
          return;
      }
      const tokensSnapshot = snapshot.child('notificationTokens');
      if (!tokensSnapshot.exists()) {
          console.log('No tokens for Post: ', postId);
          return;
      }

      // Notification details.
      const payload = {
        'data': 
            {
              'title': "Nueva Calificación",
              'body':'La publicación que has realizado ha sido revisada por nuestros profesionales,la tienes disponible en tus items',
              'type':'Qualification'
            }
      };

      const tokens = Object.keys(tokensSnapshot.val());
      console.log(tokens);

      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload).then(response => {
        // For each message check if there was an error.
        console.log("Successfully sent message:", response);

        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
          }else{
            console.log("Notificación enviada con exito");
          }
        });
        return Promise.all(tokensToRemove);
    });
  });
});

/*----------------------------------
  Eventos de comentarios 
------------------------------------*/
exports.sendCommentsNotificationCorus = functions.database.ref('/user-comments/{postId}').onWrite(event =>{
  const commentId = event.params.postId;

  console.log("PostId: "+commentId);

  if (!event.data.val()) {
    return console.log('Comment id '+commentId);
  }

  const postId = event.data["_newData"]["id"];

  return admin.database().ref('/user-comments/'+postId).once('value').then(snapshot => {
     if (!snapshot.exists()) {
          console.log('Post not found:', postId);
          return;
      }
      const tokensSnapshot = snapshot.child('notificationTokens');
      if (!tokensSnapshot.exists()) {
          console.log('No tokens for Post: ', postId);
          return;
      }

      // Notification details.
      const payload = {
        'data': 
            {
              'title': "Nuevo Comentario CoRus",
              'body':'Una de tus publicaciones ha sido comentada, presiona para verlo',
              'type':'Comment'
            }
      };

      const tokens = Object.keys(tokensSnapshot.val());
      console.log(tokens);

      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload).then(response => {
        // For each message check if there was an error.
        console.log("Successfully sent message:", response);

        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
          }else{
            console.log("Notificación enviada con exito");
          }
        });
        return Promise.all(tokensToRemove);
    });
  });


  /*return admin.database().ref('/user-posts/'+postId).once('value').then(snapshot => {
     if (!snapshot.exists()) {
          console.log('Post not found:', postId);
          return;
      }
      const tokensSnapshot = snapshot.child('notificationTokens');
      if (!tokensSnapshot.exists()) {
          console.log('No tokens for Post: ', postId);
          return;
      }

      // Notification details.
      const payload = {
        'data': 
            {
              'title': "Nuevo Comentario",
              'body':'Han realizado un comentario sobre tu publicación',
              'type':'Comment'
            }
      };

      const tokens = Object.keys(tokensSnapshot.val());
      console.log(tokens);

      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(tokens, payload).then(response => {
        // For each message check if there was an error.
        console.log("Successfully comment sent message:", response);

        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error){
            console.error('Failure sending notification to', tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
            }
          }else{
            console.log("Notificación enviada con exito");
          }
        });
        return Promise.all(tokensToRemove);
    });
  });*/
});

