const { useState } = require("react")

const FeedbackFrom = () => {
    const [formData, setFormData] = useState({
        customer_name: "", 
        phone: "", 
        email : "", 
        rating: null, 
        comments: "",
    })

    const [error, setError] =useState({
        customer_name: "",
        phone: "",
        email : "", 
        rating: null, 
        comments: "",
    })


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        let errorMessage = "";

        setFormData((prevState) => ({
            ...prevState,
            [name] : value,
        }));
    }
}