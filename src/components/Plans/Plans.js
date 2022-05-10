import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./Plans.css";
import {
  collection,
  where,
  getDocs,
  query,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

const Plans = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "customers", user.uid, "subscriptions"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        setSubscription({
          role: doc.data().role,
          current_period_end: doc.data().current_period_end.seconds,
          current_period_start: doc.data().current_period_start.seconds,
        });
      });
    };
    fetchData();
  }, [user.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "products"), where("active", "==", true));

      const querySnapshot = await getDocs(q);
      const products = {};
      querySnapshot.forEach(async (doc) => {
        products[doc.id] = doc.data();

        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        const priceQuery = query(collection(doc.ref, "prices"));

        const priceSnap = await getDocs(priceQuery);
        priceSnap.docs.forEach((priceDoc) => {
          products[doc.id].prices = {
            priceId: priceDoc.id,
            priceData: priceDoc.data(),
          };
          //   console.log(priceDoc.id, " => ", priceDoc.data());
        });
      });
      setProducts(products);
    };
    fetchData();
  }, []);

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    const docRef = await addDoc(
      collection(db, "customers", user.uid, "checkout_sessions"),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(docRef, async (snapshot) => {
      const { error, sessionId } = snapshot.data();

      if (error) {
        alert(`An error occurred: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51Ktb7ESIZFbrsrPBOtzssezGamDNLNhRROGF1gKfSax2CJuOlfslunkvaRrD88BBN5Wp0vfnjKFJluJzaHuhGxiG00U1NssC6F"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plans">
      <br />
      {subscription && (
        <p>
          Renewal Date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Plans;
