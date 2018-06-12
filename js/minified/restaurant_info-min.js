let restaurant;var map;function submitReview(){const e=getParameterByName("id"),t=getReviewData();t.restaurant_id=e,t.date="October 26, 2016",addReviewToHtml(t)}function getReviewData(){return{name:document.querySelector("#review-name").value,rating:document.querySelector("#review-rating").value,comments:document.querySelector("#reviewForm textarea").value}}function addReviewToHtml(e){document.getElementById("reviews-list").appendChild(createReviewHTML(e))}document.addEventListener("DOMContentLoaded",()=>{document.querySelector("#reviewForm").addEventListener("submit",e=>{e.preventDefault(),submitReview()})}),window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=DBHelper.imageUrlForRestaurant(e),n=DBHelper.imageUrlForRestaurant(e,"medium"),r=DBHelper.imageUrlForRestaurant(e,"small"),a=document.getElementById("restaurant-img");a.className="restaurant-img",a.src=t,a.srcset=`\n    ${r} 300w,\n    ${n} 500w,\n    ${t} 800w,\n  `,a.sizes="\n    (max-width: 991px) 90%,\n    40%\n  ",a.alt=`${e.name} restaurant`,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const l=document.createElement("td");l.innerHTML=e[n],r.appendChild(l),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach(e=>{r.appendChild(createReviewHTML(e))}),t.appendChild(r)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);const r=document.createElement("p");r.innerHTML=e.date,t.appendChild(r);const a=document.createElement("p");a.innerHTML=`Rating: ${e.rating}`,t.appendChild(a);const l=document.createElement("p");return l.innerHTML=e.comments,t.appendChild(l),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});