import * as functions from "firebase-functions";
import {DAYINMILIS, getDateId} from "../../src/utils/dateHelpers";
import {firebaseOptions} from "../../src/services/firebase/firebaseOptions";
import type Todo from "../../src/types/Todo";
import {initializeApp} from "firebase/app";
import {
  collection,
  initializeFirestore, getDocs, doc, writeBatch,
} from "firebase/firestore";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


const app = initializeApp({...firebaseOptions});

const db = initializeFirestore(app, {});


// export const testCron = functions.https
//   .onRequest(async (req, res) => {
//
export const moveYesterdaysTodoItems = functions.pubsub
    .schedule("0 0 3 * * ?")
    .timeZone("Europe/London")
    .onRun(async (ctx) => {
      const currentDate = new Date();
      const yesterday = new Date(currentDate.getTime() - DAYINMILIS);

      const sourceID = getDateId(yesterday.getTime());
      const targetID = getDateId(currentDate.getTime());
      // const x = await db.listCollections();
      const batch = writeBatch(db);


      const allUsers = await getDocs(collection(db, "users"));
      // const tryUser = await db.collection("users").doc("Aaaa").get()
      const promises = [] as Promise<any>[];
      allUsers.forEach((_d) => {
        promises.push((async (d) => {
          const targetCol = collection(
              doc(collection(d.ref, "todos"), targetID), "items");
          const allTodosSourceCol = collection(
              doc(collection(d.ref, "todos"), sourceID), "items");


          const allTodos = await getDocs(allTodosSourceCol);
          // console.log(JSON.stringify(allTodos))

          functions.logger.log({targetID, sourceID});
          allTodos.docs.forEach((_doc) => {
            const todo = _doc.data() as Todo;
            functions.logger.log({todo});
            if (todo.done) {
              return;
            }


            functions.logger.log({message: "Moving ", t: todo.text});
            batch.delete(_doc.ref);
            batch.set(doc(targetCol, todo.id), todo);
          });
        })(_d));
      });

      await Promise.all(promises);
      await batch.commit();
    });
