import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUser,
  getUserByEmail,
} from "firebase/auth";

const firebaseConfig = {


  
  apiKey: "AIzaSyBf7usfTsGVFAvfKyXMtWd8xYKomMYiLwk",
  authDomain: "statsformyuni.firebaseapp.com",
  projectId: "statsformyuni",
  storageBucket: "statsformyuni.appspot.com",
  messagingSenderId: "747391466304",
  appId: "1:747391466304:web:ad8f02ca443ffccaddd8a5",
};

// Initialize Firebase
initializeApp(firebaseConfig);

/**
 * service init
 */

const db = getFirestore();
const auth = getAuth();

/**
 * collection ref
 */

const colPatientRef = collection(db, "studentCol");

// JavaScript

// Firebase configuration

const registerNewStudentForm = document.querySelector(".registerNewStudent");
registerNewStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const EmailAddressSU = registerNewStudentForm.EmailAddress.value;
  const passwordSU = registerNewStudentForm.password.value;

  await createUserWithEmailAndPassword(auth, EmailAddressSU, passwordSU)
    .then(async (cred) => {
      const data = {
        FullName: registerNewStudentForm.FullName.value,
        BirthOfDate: registerNewStudentForm.BirthOfDate.value,
        Gender: registerNewStudentForm.Gender.value,
        Age: registerNewStudentForm.Age.value,
        AddressLine: registerNewStudentForm.AddressLine.value,
        City: registerNewStudentForm.City.value,

        Pincode: registerNewStudentForm.Pincode.value,
        states: registerNewStudentForm.states.value,
        Country: registerNewStudentForm.Country.value,
        PhoneNumber: registerNewStudentForm.PhoneNumber.value,
        EmailAddress: registerNewStudentForm.EmailAddress.value,
        password: registerNewStudentForm.password.value,
        university: registerNewStudentForm.university.value,
        Batch: registerNewStudentForm.Batch.value,
        userName: registerNewStudentForm.userName.value,
        userUID: cred.user.uid,

        essay1: registerNewStudentForm.essay1.value,
        essay2: registerNewStudentForm.essay2.value,
        essay3: registerNewStudentForm.essay3.value,
        createdDate: serverTimestamp(),
      };
      await setDoc(doc(db, "studentCol", cred.user.uid), data)
        .then(async () => {
          console.log("added the form in database");
          registerNewStudentForm.reset();

          const docRef = doc(db, "studentCol", cred.user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
           
              
        
              
                const userData = docSnap.data();
        
                // Store user data in sessionStorage
                sessionStorage.setItem("userData", JSON.stringify(userData));
        
                // Redirect to the profile page
                window.location.href = "Profile HTML.html";
              
          

            
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error adding document:", error);
        });
      console.log("user created", cred.user.email);
      console.log("user created", cred.user.uid);
      registerNewStudentForm.reset();
    })
    .then(async () => {
      
      await setTimeout(() => {
        window.location.href = "Profile HTML.html";
      }, 3000);
    })
    .catch((error) => {
      console.log("we got an ", error);
      if (error.code === "auth/email-already-in-use") {
        document.body.append("This email is already in use.");
      } else {
        document.body.append(error.message);
      }
    });
});


const signinBookForm = document.querySelector(".signinSI");
signinBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signinBookForm.emailSI.value;
  const password = signinBookForm.passSI.value;
  await signInWithEmailAndPassword(auth, email, password)
    .then(async (cred) => {
      console.log("user Signed In", cred.user);
      const docRef = doc(db, "studentCol", cred.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const userData = docSnap.data();

        // Store user data in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // Redirect to the profile page
        window.location.href = "Profile HTML.html";
      } else {
        console.log("No such document!");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
});





// index.js

// Assuming you have Firebase initialized and auth, db are defined.

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".searchForm");
  searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get the email value from the search form
      const emailToSearch = searchForm.emailToSearch.value;

      // Implement your logic to search in Firebase based on the email
      // For example, querying Firestore to find a user with the given email
      const querySnapshot = await getDocs(
          query(collection(db, "studentCol"), where("EmailAddress", "==", emailToSearch  ))
      );

      if (!querySnapshot.empty) {
          // Retrieve the first document found (assuming emails are unique)
          const userData1 = querySnapshot.docs[0].data();

          // Store user data in sessionStorage
          sessionStorage.setItem("searchedUserData", JSON.stringify(userData1));

          // Redirect to the search-results.html page
          window.location.href = "search-results.html";
      } else {
          console.log("User not found");
          // Handle case where user is not found
      }
  });
});

// Add any other functions or logic you may need here.



//  onAuthStateChanged(auth,(user)=>{
//    console.log("user state changed     ",user.email, "     and the state of the user is ")
//   })

const logoutButton = document.querySelector(".logoutProfile");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user Signed OUt");
     // Clear sessionStorage
        sessionStorage.clear();
  
        // Redirect to the home page
        window.location.href = "index.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
});




const submitFormBookForm = document.querySelector(".contactMeForm");

submitFormBookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = submitFormBookForm.nameCM.value;
    const subject = submitFormBookForm.subjectCM.value;
    const phone = submitFormBookForm.phoneCM.value;
    const email = submitFormBookForm.emailCM.value;
    const message = submitFormBookForm.messageCM.value;

    try {
        // Add form data to the "contactMe" collection
        const docRef = await addDoc(collection(db, "contactMe"), {
            name,
            subject,
            phone,
            email,
            message,
            timestamp: serverTimestamp(),
        });

        console.log("Document written with ID: ", docRef.id);
        alert("Your Query has been recorded our team will address you through email as soon as possible.\n\nPlease save Your Query ID beacouse it might be used in furthur communication.\n\nYour Query ID is:\n\n"+docRef.id+"\n\nAnd now you can go to Home Page");

        // Optionally, redirect to a confirmation page or show a success message
        
    } catch (error) {
        console.error("Error adding document: ", error);
        // Handle error, show error message, etc.
    }
});












// display.js

document.addEventListener("DOMContentLoaded", async () => {
  const userListDiv = document.querySelector(".displayProfilesBox");

  // Fetch users from Firebase and display them
  const usersSnapshot = await getDocs(collection(db, "studentCol"));

  usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();

      // Create a user box
      const userBox = document.createElement("div");
      userBox.className = "col-md-4"; // Adjust the column size based on your layout
      userBox.innerHTML = `
          <div class="card" style="width: 14rem; padding: 30px; margin: 20px;">
              
              <div class="card-body">
                  <p class="card-text">
                      <b>${userData.FullName}</b>
                      <br>
                      <i>Batch: ${userData.Batch}</i>
                      <br>
                      <b>University: ${userData.university}</b>
                      <button class="btn btn-secondary view-profile" data-userid="${userDoc.id}">View Profile</button>
                  </p>
              </div>
          </div>
      `;

      // Add a click event listener to the "View Profile" button
      userBox.querySelector(".view-profile").addEventListener("click", () => {
          // Store user data in sessionStorage
          sessionStorage.setItem("selectedUser", JSON.stringify(userData));

          // Redirect to the profile page
          window.location.href = "profile.html";
      });

      // Append the user box to the userListDiv
      userListDiv.appendChild(userBox);
  });
});












document.addEventListener("DOMContentLoaded", async () => {
  const userListDiv = document.querySelector("#profileContainer");

  // Fetch random 6 users from Firebase and display them
  const randomUsers = await getRandomUserProfiles(db, 'studentCol', 6);

  randomUsers.forEach((userData) => {
    // Create a user box
    const userBox = document.createElement("div");
    userBox.className = "col-md-4"; // Adjust the column size based on your layout
    userBox.innerHTML = `
      <div class="card" style="width: 14rem; padding: 30px; margin: 20px;">
        <div class="card-body">
          <p class="card-text"> 
            <b>${userData.FullName}</b>
            <br>
            <i>Batch: ${userData.Batch}</i>
            <br>
            <b>University: ${userData.university}</b>
            <button class="btn btn-secondary view-profile" data-userid="${userData.id}">View Profile</button>
          </p>
        </div>
      </div>
    `;

    // Add a click event listener to the "View Profile" button
    userBox.querySelector(".view-profile").addEventListener("click", () => {
      // Store user data in sessionStorage
      sessionStorage.setItem("RandomSelectedUser", JSON.stringify(userData));

      // Redirect to the profile page
      window.location.href = "RandomProfile.html";
    });

    // Append the user box to the userListDiv
    userListDiv.appendChild(userBox);
  });
});

// Function to get random user profiles
async function getRandomUserProfiles(db, collectionName, count) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Shuffle the profiles and get the first 'count' profiles
  const shuffledProfiles = profiles.sort(() => 0.5 - Math.random());
  return shuffledProfiles.slice(0, count);
}
