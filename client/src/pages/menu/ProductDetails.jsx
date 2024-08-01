import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/menu/${id}`);
                const data = await response.json();
                setProduct(data)
            } catch (error) {
                console.error('Failed to fetch product:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Failed to load product details. ${error}`,
                    icon: 'error',
                });
            }
        };
        fetchProduct();
    }, [id]);

    const handleMouseEnter = (e) => {
        const magnifier = document.querySelector('.magnifier');
        magnifier.style.display = 'block';
    };

    const handleMouseLeave = () => {
        const magnifier = document.querySelector('.magnifier');
        magnifier.style.display = 'none';
    };

    const handleMouseMove = (e) => {
        const magnifier = document.querySelector('.magnifier');
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const { clientX, clientY } = e;

        const x = clientX - left;
        const y = clientY - top;

        magnifier.style.backgroundImage = `url(${product.image})`;
        magnifier.style.backgroundSize = `${width * 2}px ${height * 2}px`;
        magnifier.style.backgroundPosition = `-${x * 2}px -${y * 2}px`;
        magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
        magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;
    };


    if (!product) {
        return <div>Loading...</div>;
    }


    return (
        <div className="section-container p-4">
            <div className="flex items-center">
                <div className="md:w-1/2 flex justify-center relative">
                    <img
                        className="object-cover size-full"
                        src={product.image}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                    <div className="magnifier"></div>
                </div>
                <div className="md:w-1/2 text-center">
                    <h1 className="text-4xl font-bold p-9">{product.name}</h1>
                    <p className="text-2xl text-gray-700">Price: ${product.price.toFixed(2)}</p>
                    <p className="text-2xl text-gray-700 p-4">Calories: {product.calories}</p>
                    <h2 className="text-3xl font-semibold mt-4">Recipe:</h2>
                    <p className="text-gray-700 mt-2">{product.recipe}</p>
                    <button className="m-4 p-4 bg-red text-white" onClick={() => navigate('/menu')}>Go back to Menu</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
