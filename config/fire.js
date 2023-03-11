const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAX3kPM8DtQwam7qjhC3OUKAIrqaG_fOCo",
  authDomain: "pos-toko-15cb4.firebaseapp.com",
  projectId: "pos-toko-15cb4",
  storageBucket: "pos-toko-15cb4.appspot.com",
  messagingSenderId: "895561848842",
  appId: "1:895561848842:web:7baacce1122ceb799a27f3",
  measurementId: "G-4BFE423JGD",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
