import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useCart from "../../hooks/useCart";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [cart, refetch] = useCart();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/menu");
        const data = await response.json();
        setMenu(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterItems = (category) => {
    let filtered;
    if (category === "all") {
      filtered = menu;
    } else if (category === "featured-favorites") {
      filtered = menu.filter((item) => item.featured === true);
    } else {
      filtered = menu.filter((item) => item.category === category);
    }
    setFilteredItems(filtered);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const categoryTitles = {
    all: 'All',
    breakfast: 'Breakfast',
    burgers: 'Burgers',
    'happy-meals': 'Happy Meals',
    beverages: 'Beverages',
    'featured-favorites': 'Featured Favorites',
  };

  const tabButtonStyles = (category) => (
    `flex object-cover justify-start items-center text-xl gap-4 tab-btn w-full hover:scale-105 transition ease-in-out delay-400 ${selectedCategory === category ? 'underline underline-offset-2 font-bold bg-gray-400' : ''}`
  );

  const lastItemIdx = currentPage * itemsPerPage;
  const firstItemIdx = lastItemIdx - itemsPerPage;
  const currentItems = filteredItems.slice(firstItemIdx, lastItemIdx);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const AddToCartHandler = (item) => { const { name, image, price, _id } = item;
    if (user && user?.email) {
      const cartItem = {
        menuItemId: _id,
        name,
        quantity: 1,
        image,
        price,
        email: user.email
      };
      fetch('http://localhost:4000/cart', {
        method: "POST",
        headers: {
          'content-type': "application/json"
        },
        body: JSON.stringify(cartItem)
      })
        .then(res => res.json())
        .then(data => {
          if (data.insertedId) {
            Swal.fire({
              title: "Good job!",
              text: `You added the item ${name}`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
            refetch()
          }
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
          Swal.fire({
            title: "Error",
            text: "Failed to add item to cart",
            icon: "error",
          });
        });
    } else {
      Swal.fire({
        title: "You Caged Chimp",
        text: "Create An Account or Login to add to cart!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Redirect"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/signup', { state: { from: location } });
        }
      });
    }
  };

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto xl:px-24 px-4">
        <h1 className="text-7xl font-bold text-center p-12">
          {categoryTitles[selectedCategory]}
        </h1>
        <div className="flex">
          <div className="w-6/7">
            {/* CARDS */}
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 cursor-pointer">
              {currentItems.map((item) => (
                <div key={item._id} className="bg-gray-100 p-4 rounded-lg flex flex-col">
                  <Link to={`/menu/${item._id}`}>
                    <img src={item.image} className="food-img mx-auto" />
                  </Link>
                  <div className="mt-5 space-y-1">
                    <div className="font-semibold text-center">{item.name}</div>
                  </div>
                  <button
                    className="bg-red py-1 px-4 text-sm text-white hover:scale-90 transition ease-in-out delay-400 text-xs mt-2"
                    onClick={() => AddToCartHandler(item)}
                  >
                    ADD TO CART
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div className="w-1/7 ml-4 border border-gray-300 bg-gray-200 p-4 rounded">
            {['all', 'breakfast', 'burgers', 'happy-meals', 'beverages', 'featured-favorites'].map((category) => (
              <button
                key={category}
                className={tabButtonStyles(category)}
                onClick={() => filterItems(category)}
              >
                <img src={`/images/shop/${category}-tab.png`} alt={category} className="tab-img" />
                {categoryTitles[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center p-10">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 py-4 px-7 ${currentPage === index + 1 ? "bg-red text-white" : "bg-gray-300"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
