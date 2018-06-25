let restaurant;var map;let unsavedReviews=[];function checkIfStartIsActive(){const e=getParameterByName("id"),t=DBHelper.isRestaurantFav(e),n=document.querySelector(".favorite-star");console.log(t,"isFav"),console.log(n),t?n.classList.add("true"):n.classList.remove("true")}function toggleFav(e){e.target.classList.toggle("true");const t=getParameterByName("id"),n=e.target.classList.contains("true");console.log(n,"is favorite"),window.navigator.onLine?(DBHelper.updateFavoriteRestaurant(n,t),fetch(`http://localhost:1337/restaurants/${t}/?is_favorite=${n}`,{method:"POST"})):DBHelper.updateFavoriteRestaurant(n,t)}function submitReview(){const e=getParameterByName("id"),t=getReviewData();t.restaurant_id=e,addReviewToHtml(t),console.log(t),window.navigator.onLine?fetch("http://localhost:1337/reviews/",{method:"post",body:JSON.stringify(t)}):(unsavedReviews.push(t),console.log(unsavedReviews,"unsavedReviews"))}function getReviewData(){return{name:document.querySelector("#review-name").value,rating:document.querySelector("#review-rating").value,comments:document.querySelector("#reviewForm textarea").value}}function addReviewToHtml(e){document.getElementById("reviews-list").appendChild(createReviewHTML(e))}function submitAllUnsavedReviews(){console.log("uploading unsaved reviews"),unsavedReviews.map(e=>{fetch("http://localhost:1337/reviews/",{method:"post",body:JSON.stringify(e)})}),unsavedReviews=[]}document.addEventListener("DOMContentLoaded",()=>{DBHelper.fetchRestaurants(),document.querySelector("#reviewForm").addEventListener("submit",e=>{e.preventDefault(),submitReview()}),document.querySelector(".favorite-star").addEventListener("click",e=>{toggleFav(e)}),checkIfStartIsActive()}),window.initMap=(async()=>{const e=await fetchRestaurantFromURL();self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:e.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)}),fetchRestaurantFromURL=(async e=>{const t=getParameterByName("id"),n=await DBHelper.fetchRestaurantById(t),a=await DBHelper.fetchReviewsByRestaurantId(t);return console.log(n),console.log(a),self.restaurant=n,self.reviews=a,fillRestaurantHTML(),n}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=DBHelper.imageUrlForRestaurant(e),n=DBHelper.imageUrlForRestaurant(e,"medium"),a=DBHelper.imageUrlForRestaurant(e,"small"),r=document.getElementById("restaurant-img");r.className="restaurant-img",r.src=t,r.srcset=`\n    ${a} 300w,\n    ${n} 500w,\n    ${t} 800w,\n  `,r.sizes="\n    (max-width: 991px) 90%,\n    40%\n  ",r.alt=`${e.name} restaurant`,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,a.appendChild(r);const s=document.createElement("td");s.innerHTML=e[n],a.appendChild(s),t.appendChild(a)}}),fillReviewsHTML=((e=self.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const a=document.createElement("p");a.innerHTML=`Rating: ${e.rating}`,t.appendChild(a);const r=document.createElement("p");return r.innerHTML=e.comments,t.appendChild(r),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}),window.addEventListener("offline",function(e){const t=document.querySelector(".network-panel");t.classList.add("offline"),t.classList.remove("online"),t.innerHTML="Offline"}),window.addEventListener("online",function(e){const t=document.querySelector(".network-panel");t.classList.add("online"),t.classList.remove("offline"),t.innerHTML="Back online",submitAllUnsavedReviews(),setTimeout(()=>{t.classList.remove("online"),t.innerHTML=""},2e3)});