// all the api calls to the firebase database
/*
Being Called from:
SendMessage - chat page direct message

*/
import {
  updateDoc,
  getDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  increment,
  setDoc,
} from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

//sends a message to already exciting chat "chats"
export const sendAMessage = async (combinedId, message, senderId, tile) => {
  try {
    await updateDoc(doc(firebaseDb, "chats", combinedId), {
      messages: arrayUnion({
        id: uuidv4(),
        text: message,
        ...(tile && { tile: { ...tile } }), //adds tile only if it exists
        senderId: senderId,
        date: Timestamp.now(),
      }),
    });
    console.log("message added to chat");
  } catch (error) {
    console.log(error);
  }
};

export const setSeenLastMssgTime = async (
  collection,
  document,
  needData,
  combinedId,
  partnerUID,
  partnerDisName,
  partnerImg,
  userUID,
  userDisName,
  userImg,
  message,
  seenBySender
) => {
  console.log("Message received here", message);
  try {
    const receiverChatExists = await doesDocumentExist(
      collection,
      document,
      needData
    );
    const senderChatExists = await doesDocumentExist(
      collection,
      userUID,
      needData
    );
    if (!receiverChatExists) {
      console.log("receiver userchat didn't exist");
      //make sure convo been sender and receiver exists and set receivers to not seen
      createUserChat(
        partnerUID,
        combinedId,
        userUID,
        userDisName,
        userImg,
        message,
        false
      );
      console.log("userChat for receiver created");
      updateUnseen(partnerUID, 1);
      console.log("add 1 to receiver unseen");
    } else if (receiverChatExists[combinedId]?.lastMessage?.seen == true) {
      //if receiver saw last mssg
      updateUnseen(partnerUID, 1);
      console.log("add 1 to receiver unseen because seen was true");
    }

    if (!senderChatExists) {
      console.log("sender userchat didn't exist");
      createUserChat(
        userUID,
        combinedId,
        partnerUID,
        partnerDisName,
        partnerImg,
        message,
        true
      );
      console.log("created sender userChat");
    } else if (senderChatExists[combinedId]?.lastMessage?.seen == false) {
      if (seenBySender == true) {
        updateUnseen(userUID, -1);
        console.log("sender unseen reduced by 1");
      }
    }

    //updates last message and lastmessage seen for the sender
    if (seenBySender == "no") {
      const senderChatExists = await doesDocumentExist(
        collection,
        userUID,
        needData
      );
      console.log("seen by user is no");
      console.log("SEEN?", senderChatExists[combinedId]?.lastMessage?.seen);
      let newSeen =
        senderChatExists[combinedId]?.lastMessage?.seen == true ||
        senderChatExists[combinedId]?.lastMessage?.seen == false
          ? senderChatExists[combinedId].lastMessage.seen
          : true;
      console.log("New Seen", newSeen);

      updateUserChat(
        userUID,
        combinedId,
        partnerUID,
        partnerDisName,
        partnerImg,
        message,
        newSeen
      );
    } else {
      updateUserChat(
        userUID,
        combinedId,
        partnerUID,
        partnerDisName,
        partnerImg,
        message,
        seenBySender
      );
    }

    //UPDATES RECEIVER DATA. Sets last message and set lastmessage seen as false
    updateUserChat(
      partnerUID,
      combinedId,
      userUID,
      userDisName,
      userImg,
      message,
      false
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateUnseen = async (user, number) => {
  try {
    const seenNumber = await doesDocumentExist("unseenMessages", user, true);
    console.log("CHECK HERE", seenNumber.unseenMessage);
    if (seenNumber.unseenMessage <= 0 && number == -1) {
      console.log("unseen was below negative");
      await updateDoc(doc(firebaseDb, "unseenMessages", user), {
        unseenMessage: 0,
      });
    } else if (seenNumber.unseenMessage <= 0) {
      console.log("unseen was below negative 2");
      await updateDoc(doc(firebaseDb, "unseenMessages", user), {
        unseenMessage: 1,
      });
    } else {
      await updateDoc(doc(firebaseDb, "unseenMessages", user), {
        unseenMessage: increment(number),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//updates the the userChat for one person - the one with document id
export const updateUserChat = async (
  document,
  combinedId,
  uid,
  displayName,
  photoUrl,
  message,
  seen
) => {
  try {
    console.log("SEEN HERE", seen, document);
    await updateDoc(doc(firebaseDb, "userChats", document), {
      [combinedId]: {
        userinfo: {
          uid: uid,
          displayName: displayName,
          photoUrl: photoUrl,
        },
        lastMessage: {
          message,
          seen: seen,
        },
        date: serverTimestamp(),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

//create the the userChat for one person - the one with document id
export const createUserChat = async (
  document,
  combinedId,
  uid,
  displayName,
  photoUrl,
  message,
  seen
) => {
  try {
    await setDoc(doc(firebaseDb, "userChats", document), {
      [combinedId]: {
        userinfo: {
          uid: uid,
          displayName: displayName,
          photoUrl: photoUrl,
        },
        lastMessage: {
          message,
          seen: seen,
        },
        date: serverTimestamp(),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

//check to see if a document in collection exists. returns True or false if needData is false.
// If need Data, send data is the document
export const doesDocumentExist = async (collection, document, needData) => {
  const docRef = doc(firebaseDb, collection, document);
  try {
    const res = await getDoc(docRef);
    if (res.exists() && needData) {
      console.log("needData");
      return res.data();
    } else {
      console.log("don't need data");
      return res.exists();
    }
  } catch (error) {
    console.log(error);
  }
};

//updates firestore for friend request and accept notification
export const updateFriendRequest = async (userName, friendId, friendButton) => {
  //only runs if action is sending friend request or acceptiing friend request
  if (
    friendButton == "Send Friend Request" ||
    friendButton == "Accept Friend Request"
  ) {
    try {
      const isfriendRequestNewsFull = await doesDocumentExist(
        "notifications",
        friendId,
        true
      );
      if (isfriendRequestNewsFull.friendRequestNews.length < 50) {
        const entry =
          friendButton == "Send Friend Request"
            ? `${userName} sent a friend request.`
            : `${userName} accepted the friend request.`;
        await updateDoc(doc(firebaseDb, "notifications", friendId), {
          friendRequestNews: arrayUnion(entry),
        });
      }
      await updateDoc(doc(firebaseDb, "notifications", friendId), {
        newFriendRequest: increment(1),
      });
    } catch (error) {
      console.log(error);
    }
  }
};

//updates notification data when a tile is liked
export const updateLikesNotification = async (userName, friendId) => {
  try {
    const isLikeNewsFull = await doesDocumentExist(
      "notifications",
      friendId,
      true
    );
    if (isLikeNewsFull.likeNews.length < 50) {
      await updateDoc(doc(firebaseDb, "notifications", friendId), {
        likeNews: arrayUnion(`${userName}`),
      });
    }
    await updateDoc(doc(firebaseDb, "notifications", friendId), {
      newLikes: increment(1),
    });
  } catch (error) {
    console.log(error);
  }
};

export const resetNotifications = async (userId) => {
  try {
    await updateDoc(doc(firebaseDb, "notifications", userId), {
      friendRequestNews: [],
      likeNews: [],
      newFriendRequest: 0,
      newLikes: 0,
    });
  } catch (error) {
    console.log(error);
  }
};
