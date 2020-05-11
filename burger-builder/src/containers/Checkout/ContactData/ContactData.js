import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
class ContactData extends Component {
    state = {
        orderForm: {

            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
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
                value: '',
                validation: {},//So that it does not return undefined
                valid: true
            }
        },
        formIsValid: false,
        loading: false
    }
    checkValid(value, rules) {
        let isValid = true;//Setting it initially to true so that when condition is 
        //Checked in if statement then it should not be overridded by the other ifs.
        // if (!rules) {
        //     return true;  //If there is no validation like in drop down
        // }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid//Checking if the string enterd is not blank spaces
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid
        }

        return isValid;
    }


    orderHandler = (event) => {
        event.preventDefault();//Because I dont want to send request automatically.That would reload my page.
        let formData = {};
        for (let key in this.state.orderForm) {
            formData[key] = this.state.orderForm[key].value;
        }
        this.setState({ loading: true });
        const order = {//Preparing the data to pass to the server 
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData

        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: true });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({ loading: true });
            });

    }
    inputChangeHandler = (event, inputIdentifier) => {
        //We are using an inputidentifier so that we can set the values 
        //to the correct inputIdentifier.
        //we have to always use setState this way    
        const updateForm = {
            ...this.state.orderForm//Here it wiil only be ashallow copy and because we have to go inside 
            //it as well I will make a copy of it again.
        };
        const updateFormElement = {
            ...updateForm[inputIdentifier]
        };
        updateFormElement.value = event.target.value;
        updateFormElement.valid = this.checkValid(updateFormElement.value, updateFormElement.validation);
        updateFormElement.touched = true;//To highlight the form fields only if the user touvhed the field otherwise not.
        updateForm[inputIdentifier] = updateFormElement;
        let formIsValid = true;
        for (let key in updateForm) {
            formIsValid = updateForm[key].valid && formIsValid;
        }
        console.log(updateFormElement);
        this.setState({ orderForm: updateForm, formIsValid: formIsValid });

    }


    render() {
        let formElementsArray = [];//We are creating an array of formData
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }


        let form = (<form>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}//Passing the aary data into the Input tag.
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    touched={formElement.config.touched}////To highlight the form fields only if the user touvhed the field otherwise not.
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}//It is set for drop down menu to not highlight it
                    clicked={(event) => { this.inputChangeHandler(event, formElement.id) }} />//Making it an anonymous function so that we can pass an id
            ))}
            <Button btnType="Success"
                disabled={!this.state.formIsValid}
                clicked={this.orderHandler}> Order</Button>
        </form>);
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={styles.ContactData}>
                <h4>Enter your contact Details here!!</h4>
                {form}
            </div>
        );
    }

}

export default ContactData;