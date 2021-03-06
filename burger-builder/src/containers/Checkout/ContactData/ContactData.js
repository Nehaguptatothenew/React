import React, { useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import * as actionCreators from '../../../store/actions/index';
import { updatedObject, checkValid } from '../../../shared/utility';
const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your N￼ame'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false//To highlight the form fields only if the user touvhed the field otherwise not.
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },


        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIPCode'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5

            },
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'email',
            elementConfig: {
                type: 'text',
                placeholder: 'Your email'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        delivery: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'fastest', displayValue: 'Fastest' },
                    { value: 'cheapest', displayValue: 'Cheapest' }
                ]
            },
            value: 'fastest',
            validation: {},//So that it does not return undefined
            valid: true
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);



   const orderHandler = (event) => {
        event.preventDefault();//Because I dont want to send request automatically.That would reload my page.
        let formData = {};
        for (let key in orderForm) {
            formData[key] = orderForm[key].value;
        }
        // this.setState({ loading: true });
        const order = {//Preparing the data to pass to the server 
            ingredients:props.ingred,
            price:props.price,
            orderData: formData,
            userId: props.userId

        }
        this.props.onOrderBurger(order, props.token);
        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading: true });
        //         this.props.history.push('/');
        //     })
        //     .catch(error => {
        //         this.setState({ loading: true });
        //     });

        //We have performed this in action in order.
    }
    const inputChangeHandler = (event, inputIdentifier) => {
        //We are using an inputidentifier so that we can set the values 
        //to the correct inputIdentifier.
        //we have to always use setState this way   
        //We can do it this way also 
        // const updateForm = {
        //     ...this.state.orderForm//Here it wiil only be ashallow copy and because we have to go inside 
        //     //it as well I will make a copy of it again.
        // };
        // const updateFormElement = {
        //     ...updateForm[inputIdentifier]
        // };
        // updateFormElement.value = event.target.value;
        // updateFormElement.valid = this.checkValid(updateFormElement.value, updateFormElement.validation);
        // updateFormElement.touched = true;//To highlight the form fields only if the user touvhed the field otherwise not.
        // updateForm[inputIdentifier] = updateFormElement;
        const updateFormElement = updatedObject(orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValid(event.target.value, orderForm[inputIdentifier].validation),
            touched: true//To highlight the form fields only if the user touvhed the field otherwise not.  
        })
        const updateForm = updatedObject(orderForm, {
            [inputIdentifier]: updateFormElement
        })
        updateForm[inputIdentifier] = updateFormElement;
        let formIsValid = true;
        for (let key in updateForm) {
            formIsValid = updateForm[key].valid && formIsValid;
        }
        console.log(updateFormElement);
        setOrderForm(updateForm)
        setFormIsValid(formIsValid)

    }


    
        let formElementsArray = [];//We are creating an array of formData
        for (let key in orderForm) {
            formElementsArray.push({
                id: key,
                config: orderForm[key]
            });
        }


        let form = (<form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}//Passing the aary data into the Input tag.
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    touched={formElement.config.touched}////To highlight the form fields only if the user touvhed the field otherwise not.
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}//It is set for drop down menu to not highlight it
                    clicked={(event) => {inputChangeHandler(event, formElement.id) }} />//Making it an anonymous function so that we can pass an id
            ))}
            <Button btnType="Success"
                disabled={!formIsValid}
                clicked={orderHandler}> Order</Button>
        </form>);
        if (props.loading) {
            form = <Spinner />
        }
        return (
            <div className={styles.ContactData}>
                <h4>Enter your contact Details here!!</h4>
                {form}
            </div>
        );
    

}
const mapStateToProps = state => {
    return {//Because now we have a root reducer
        ingred: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actionCreators.purchaseBurger(orderData, token))
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));