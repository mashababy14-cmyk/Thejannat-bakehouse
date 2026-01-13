/* =================================================
   THE JANNAT BAKEHOUSE - MAIN JAVASCRIPT FILE
   ================================================= */

/* ----------------------------------
   ১. হ্যামবার্গার মেনু লজিক (Navbar)
   ---------------------------------- */
let menuIcon = document.querySelector(".icon");
let menuIconShape = document.querySelector(".icon i");
let navbar = document.querySelector(".navbar");

// মেনু ওপেন/ক্লোজ করা
if (menuIcon) {
  menuIcon.onclick = () => {
    navbar.classList.toggle("active");

    // আইকন পরিবর্তন (Bars <-> X)
    if (navbar.classList.contains("active")) {
      menuIconShape.classList.remove("fa-bars");
      menuIconShape.classList.add("fa-x");
    } else {
      menuIconShape.classList.remove("fa-x");
      menuIconShape.classList.add("fa-bars");
    }
  };
}

// মেনুর লিংকে ক্লিক করলে মেনু বন্ধ হবে
document.querySelectorAll(".navbar a").forEach((link) => {
  link.onclick = () => {
    navbar.classList.remove("active");
    menuIconShape.classList.remove("fa-x");
    menuIconShape.classList.add("fa-bars");
  };
});

// স্ক্রল করলে মেনু বন্ধ হবে
window.onscroll = () => {
  navbar.classList.remove("active");
  if (menuIconShape) {
    menuIconShape.classList.remove("fa-x");
    menuIconShape.classList.add("fa-bars");
  }
};

/* ----------------------------------
   ২. প্রি-লোডার লজিক (Loading Screen)
   ---------------------------------- */
window.onload = function () {
  // ইনডেক্স পেজে প্রি-লোডার থাকলে কাজ করবে
  let preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(function () {
      preloader.style.opacity = "0"; // ফেইড আউট
      setTimeout(() => {
        preloader.style.display = "none"; // গায়েব
      }, 1000);
    }, 3000); // ৩ সেকেন্ড পর
  }
};

/* ----------------------------------
   ৩. প্রোডাক্ট ডিটেইলস ও প্রাইস ক্যালকুলেটর
   ---------------------------------- */

// (A) ইনডেক্স পেজ থেকে ডাটা সেভ করা
function showDetails(image, name, price, desc) {
  const product = {
    img: image,
    name: name,
    price: price,
    desc: desc,
  };
  localStorage.setItem("selectedCake", JSON.stringify(product));
  window.location.href = "product-details.html";
}

// (B) ডিটেইলস পেজ লোড হলে ডাটা দেখানো ও হিসাব করা
if (document.getElementById("details")) {
  const storedProduct = localStorage.getItem("selectedCake");

  if (storedProduct) {
    const product = JSON.parse(storedProduct);

    // HTML এলিমেন্টে তথ্য বসানো
    document.getElementById("MainImg").src = product.img;
    document.getElementById("cakeName").innerText = product.name;
    document.getElementById("cakeDetails").innerText = product.desc;

    // --- প্রাইস ক্যালকুলেশন লজিক ---

    // ডিফল্ট বেস প্রাইস (যদি স্ট্রিং থেকে সংখ্যা না পাওয়া যায়, তবে ৮০০ ধরা হবে)
    let basePrice = 800;
    // দামের স্ট্রিং থেকে সংখ্যা বের করা (যেমন "1200 Tk" -> 1200)
    let priceMatch = product.price.match(/\d+/);
    if (priceMatch) {
      basePrice = parseInt(priceMatch[0]);
    }

    const weightSelect = document.getElementById("weightSelect");
    const flavorSelect = document.getElementById("flavorSelect");
    const priceDisplay = document.getElementById("cakePrice");
    const waBtn = document.getElementById("whatsappBtn");

    // চকলেট ফ্লেভারের চার্ট (রেফারেন্স প্রাইস)
    const chocolateRateChart = {
      0.5: 450,
      1: 750,
      1.5: 1100,
      2: 1400,
      3: 1800,
      4: 2400,
      5: 3000,
    };

    // ফ্লেভার এডজাস্টমেন্ট
    const flavorAdjustments = {
      Chocolate: 0,
      Vanilla: -100,
      "Red Velvet": 100,
      "Black Forest": 50,
    };

    function updatePrice() {
      let weight = weightSelect.value;
      let flavor = flavorSelect.value;

      // বেস প্রাইস নির্ধারণ
      // যদি চার্টে এই ওজনের দাম থাকে, সেটা নিবে। না থাকলে বেস প্রাইস * ওজন।
      let price = chocolateRateChart[weight] || basePrice * parseFloat(weight);

      // ফ্লেভারের দাম যোগ/বিয়োগ
      let adjust = flavorAdjustments[flavor] || 0;

      // হাফ পাউন্ডের জন্য ডিসকাউন্ট অর্ধেক হবে
      if (weight === "0.5") {
        adjust = adjust / 2;
      }

      let total = price + adjust;

      // দাম আপডেট করা
      priceDisplay.innerText = total + " Tk";

      // --- WhatsApp লিংক তৈরি ---
      const myNumber = "8801622229921"; // তোমার নাম্বার

      // মেসেজ ফরম্যাট (নতুন লাইনের জন্য %0a)
      let msg = `Hello Jannat Bakehouse,%0a`;
      msg += `I want to order:%0a`;
      msg += `🎂 Name: ${product.name}%0a`;
      msg += `⚖️ Weight: ${weight} Pound%0a`;
      msg += `🍦 Flavor: ${flavor}%0a`;
      msg += `💰 Estimated Price: ${total} Tk`;

      waBtn.href = `https://wa.me/${myNumber}?text=${msg}`;
    }

    // ইউজার চেঞ্জ করলে দাম আপডেট হবে
    weightSelect.addEventListener("change", updatePrice);
    flavorSelect.addEventListener("change", updatePrice);

    // পেজ লোড হওয়ার সাথে সাথে একবার রান হবে
    updatePrice();
  }
}
