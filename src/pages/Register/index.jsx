import React, { Component } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBProgress, MDBRangeInput, MDBIcon } from "mdbreact";
import ReactPasswordStrength from 'react-password-strength';
import Autosuggest from 'react-autosuggest';

// Icons
// import { FaFacebook } from 'react-icons/fa';
// CSS
import "./register.scss";

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'C#',
    year: 2000
  },
  {
    name: 'C++',
    year: 1983
  },
  {
    name: 'Clojure',
    year: 2007
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Go',
    year: 2009
  },
  {
    name: 'Haskell',
    year: 1990
  },
  {
    name: 'Java',
    year: 1995
  },
  {
    name: 'Javascript',
    year: 1995
  },
  {
    name: 'Perl',
    year: 1987
  },
  {
    name: 'PHP',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  },
  {
    name: 'Ruby',
    year: 1995
  },
  {
    name: 'Scala',
    year: 2003
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');
  const suggestions = languages.filter(language => regex.test(language.name));
  
  if (suggestions.length === 0) {
    return [
      { isAddNew: true }
    ];
  }
  
  return suggestions;
}

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      formActivePanel1: 1,
      formActivePanel1Changed: false,
      formActivePanel2: 1,
      formActivePanel2Changed: false,
      formActivePanel3: 1,
      formActivePanel3Changed: false,
      first_name: "",
      last_name: "",
      email: this.getEmail(),
      company: { isCompany: false, vatNumber: "", vatCountryCode:  "", vatAddress: "", hasVAT: false, name: "", suggestions: [] },
      passwordtemp: "",
      passwordrepeat: "",
      password: { valid: false, value: "", score: undefined },
      temp: { vat: "" },
      address: { country: "", zip: "", street: "", city: "" },
      validate: { email: undefined },
      vattemp: undefined, // True = Valid VAT, False = Invalid VAT, Undefined = No VAT
      personalisation: { informal: true, gdpr: false, newsletter: false, connection: 50 },
      progress: { value: 25, text: "Gleich geschafft!", lastPoint: 1},
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePersonalisationCheckboxChange = this.handlePersonalisationCheckboxChange.bind(this);
    this.handlePersonalisationSliderChange1 = this.handlePersonalisationSliderChange1.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handleCompanyChange = this.handleCompanyChange.bind(this);
    this.validateVAT = this.validateVAT.bind(this);
  }

  handlePasswordChange = (event) => {
    this.setState({passwordtemp: event}, () => this.validatePassword());
    
  }

  handlePersonalisationCheckboxChange = (event) => {
    let field = event.target.name;
    let value = event.target.checked;

    this.setState(prevState => ({
      personalisation: {
        ...prevState.personalisation,
        [field]: value
      }
    }));
  }

  handlePersonalisationSliderChange1 = (event) => {
    let field = "connection";
    let value = parseInt(event, 10);

    this.setState(prevState => ({
      personalisation: {
        ...prevState.personalisation,
        [field]: value
      }
    }));
  }

  repeatPassword = (event) => {
    this.setState({passwordrepeat: event.target.value}, () => this.validatePassword());
    
  } 

  validatePassword = () => {
    if(this.state.passwordtemp !== "" && this.state.passwordtemp !== undefined && this.state.passwordrepeat !== "" && this.state.passwordrepeat !== undefined){
      if(this.state.passwordtemp.password === this.state.passwordrepeat && this.state.passwordtemp.score > 0){
        this.setState(prevState => ({
          password: {
            ...prevState.password,
            value: this.state.passwordtemp.password,
            valid: true,
            score: this.state.passwordtemp.score
          },
        }));
        // Show success
        //event.target.className += " is-valid";
      } else {
        this.setState(prevState => ({
          password: {
            ...prevState.password,
            value: "",
            valid: false,
            score: undefined
          },
        }));
      }
    }
  }

  handleChange(event) {
    // Get the name of the input field
    let field = event.target.name;
    // Save the current value into the desired state
    this.setState({[field]: event.target.value});
  }

  handleAddressChange(event) {
    let field = event.target.name;
    let value = event.target.value;

    this.setState(prevState => ({
      address: {
        ...prevState.address,
        [field]: value
      }
    }));
  }

  /*swapFormActive = a => param => e => {
    if(this.checkSwap(param)){
      console.log("Yes");
      this.setState({
        ["formActivePanel" + a]: param,
        ["formActivePanel" + a + "Changed"]: true
      });
      this.setState(prevState => ({
        progress: {
          ...prevState.progress,
          value: param * 10,
          text: "Legen wir los!"
        }
      }));
    } else {
      console.log("Action blocked.");
    }
  };*/

  checkSwap = (param) => {
    //return true;

    switch(param){
      case 1:
        return true;
      case 2:
        if(this.state.email !== "" && this.state.email !== undefined && this.state.first_name !== "" && this.state.first_name !== undefined && this.state.last_name !== "" && this.state.last_name !== undefined && this.state.password.valid === true){
          return true;
        } else {
          return false;
        }
      case 3:
        if(this.state.company.isCompany === false){
          if(this.state.address.street !== "" && this.state.address.city !== "" && this.state.address.country !== "" && this.state.address.zip !== ""){
            return true;
          } else {
            return false;
          }
        } else if (this.state.company.isCompany === true){
          if(this.state.address.street !== "" && this.state.address.city !== "" && this.state.address.country !== "" && this.state.address.zip !== "" && this.state.company.name !== ""){
            if(this.state.company.hasVAT){
              if(this.state.company.vatAddress !== "" && this.state.company.vatNumber !== ""){
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      case 4:
        if(this.state.personalisation.gdpr){
          return true;
        }else{
          return false;
        }
      default:
        return false;
    }
  }

  handleNextPrevClick = a => param => e => {
    if(this.checkSwap(param)){
      console.log("Yes");
      this.setState({
        ["formActivePanel" + a]: param,
        ["formActivePanel" + a + "Changed"]: true
      });
      if(param > this.state.progress.lastPoint){
        this.setState(prevState => ({
          progress: {
            ...prevState.progress,
            value: this.state.progress.value + 25,
            text: "Wir sind fast da!",
            lastPoint: param
          }
        }));
      }
    } else {
      console.log("Not enough information!");
    }
    
  };

  handleSubmission = () => {
    alert("Form submitted!");
  };

  calculateAutofocus = a => {
    if (this.state["formActivePanel" + a + "Changed"]) {
      return true;
    }
  };

  // Get values from login
  getEmail = () => {
      if(this.props.location.state.email !== "" || this.props.location.state.email !== undefined || this.props.location.state.email !== null){
        return this.props.location.state.email;
      } else {
        return "";
      }
  }

  foo = () => {

  }

  // Company values
  handleCompanyChange(event) {
    let field = event.target.name;
    let value = event.target.value;
    switch(field) {
      case 'company_name':
        this.setState(prevState => ({
          company: {
            ...prevState.company,
            name: value
          }
        }));
        break;
      case 'company_vat':
        this.setState(prevState => ({
          temp: {
            ...prevState.temp,
            vat: value
          }
        }));
        if(value === ""){
          this.setState({vattemp: undefined});
        }
        if(this.validateVAT(value)){

        }
        break;
      default:
        return 'foo';
    }
  }

  onClick = nr => () =>{
    let companystate = false;
    console.log(nr);
    if(nr === 2){
      companystate = true;
    }

    this.setState(prevState => ({
      company: {
        ...prevState.company,
        isCompany: companystate
      }
    }));
  }

  validateVAT = (raw) => {
    let validate = require('validate-vat');
    let input = raw.replace(/\s/g, '');
    let countrycode = input.substring(0,2);
    let vatnumber = input.substring(2);

    validate ( countrycode,  vatnumber, (err, validationInfo) => {
      console.log(err);
      console.log(validationInfo);
      if(validationInfo === undefined){
        if(this.state.temp.vat !== ""){
          this.setState({vattemp: false});
        } else {
          this.setState({vattemp: undefined});
        }
        
      }
      if(validationInfo !== undefined && validationInfo !== null){
        if(validationInfo.valid === true){
          // Error is here - "this" is not recognized
          this.setState(prevState => ({
            company: {
              ...prevState.company,
              vatNumber: validationInfo.vatNumber,
              vatCountryCode: validationInfo.countryCode,
              vatAddress: validationInfo.address,
              hasVAT: true,
              name: validationInfo.name
            }
          }));
          this.setState({vattemp: true});
          let address_parts = validationInfo.address.split(',');
          this.setState(prevState => ({
            address: {
              ...prevState.address,
              country: validationInfo.countryCode.toUpperCase(),
              street: address_parts[0].trim()
            }
          }));
          return true;
        } else {
          this.setState(prevState => ({
            company: {
              ...prevState.company,
              vatNumber: "",
              vatCountryCode: "",
              vatAddress: "",
              hasVAT: false
            }
          }));
          this.setState({vattemp: false});
          return false;
        }
      } else {
        console.log("Still waiting");
      }
    });
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState(prevState => ({
      company: {
        ...prevState.company,
        suggestions: getSuggestions(value)
      }
    }));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState(prevState => ({
      company: {
        ...prevState.company,
        suggestions: []
      }
    }));
  };

  onCompanyNameChange = (event, { newValue }) => {
    this.setState(prevState => ({
      company: {
        ...prevState.company,
        name: newValue
      }
    }));
  };

  onSuggestionSelected = (event, { suggestion }) => {
    if (suggestion.isAddNew) {
      console.log('Add new:', this.state.company.name);
    }
  };

  getSuggestionValue = suggestion => {
    if (suggestion.isAddNew) {
      return this.state.name;
    }
    
    return suggestion.name;
  };

   renderSuggestion = suggestion => {
    if (suggestion.isAddNew) {
      return (
        <span>
          [+] Neu erstellen: <strong>{this.state.company.name}</strong>
        </span>
      );
    }

    return suggestion.name;
  };
  
  render() {
    
    let test = this.props.location.state
    console.log(test);
    console.log(this.state);

    const { suggestions } = this.state.company;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      value: this.state.company.name,
      onChange: this.onCompanyNameChange,
      className: "form-control"
    };

    return (
      <MDBContainer className="mt-5">
            <h2 className="text-center font-weight-bold pt-4 pb-5 mb-2">
              <strong>Nur noch wenige Schritte!</strong>
            </h2>
            <MDBProgress material value={this.state.progress.value}>
              {this.state.progress.text}
            </MDBProgress>
            {/*<MDBStepper icon>
              <MDBStep
                icon="folder-open"
                stepName="Basic Information"
                onClick={this.swapFormActive(2)(1)}
              />
              <MDBStep
                icon="pencil-alt"
                stepName="Personal Data"
                onClick={this.swapFormActive(2)(2)}
              />
              <MDBStep
                icon="image"
                stepName="Terms and Conditions"
                onClick={this.swapFormActive(2)(3)}
              />
              <MDBStep
                icon="check"
                stepName="Finish"
                onClick={this.swapFormActive(2)(4)}
              />
            </MDBStepper>*/}

            <div>
              <input autoComplete="false" name="hidden" type="hidden" value="llama"/>
              <MDBRow>
                {this.state.formActivePanel2 === 1 && (
                  <MDBCol md="6" className="m-auto">
                  
                    <h3 className="font-weight-bold pl-0 my-4">
                      <strong>Allgemeine Informationen</strong>
                    </h3>
                    
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput">E-Mail<span className="deep-orange-text pl-1">*</span></label>
                        <input
                          value={ this.state.email }
                          type="email"
                          name="email"
                          className="form-control"
                          autoFocus={this.calculateAutofocus(2)}
                          onChange={ this.handleChange }
                          required
                        />
                        <small id="emailHelp" className="form-text text-muted">
                          Wir geben Ihre E-Mail-Adresse niemals an Dritte weiter.
                        </small>
                        <div style={{ top: "auto" }} className="invalid-tooltip">
                          Bitte geben Sie eine gültige E-Mail Adresse ein
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput">Vorname<span className="deep-orange-text pl-1">*</span></label>
                        <input
                          value={ this.state.first_name }
                          type="text"
                          name="first_name"
                          className="form-control"
                          onChange={ this.handleChange }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput">Nachname<span className="deep-orange-text pl-1">*</span></label>
                        <input
                          value={ this.state.last_name }
                          type="text"
                          name="last_name"
                          className="form-control"
                          onChange={ this.handleChange }
                          required
                        />
                      </div>
                      <hr />
                      { this.state.progress.lastPoint === 1 ? (
                        <div>
                          <div className="form-group">
                            <label htmlFor="formGroupPasswordTemp">Passwort<span className="deep-orange-text pl-1">*</span></label>
                            <ReactPasswordStrength
                              minLength={5}
                              minScore={2}
                              scoreWords={['schwach', 'okay', 'gut', 'stark', 'sehr stark']}
                              tooShortWord="zu schwach"
                              changeCallback={ this.handlePasswordChange }
                              value = { this.state.password_temp }
                              inputProps={{ name: "password_temp", autoComplete: "off", className: "" }}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="formGroupPasswordRepeat">Passwort wiederholen<span className="deep-orange-text pl-1">*</span></label>
                            <input
                              value={ this.state.password_repeat }
                              type="password"
                              name="password_repeat"
                              className= { this.state.password.valid ? 'form-control is-valid' : 'form-control' }
                              onChange={ this.repeatPassword }
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted"><MDBIcon icon="check" className="green-text pr-2"/>Das Passwort wurde erfolgreich gesetzt</p>
                      ) }
                      <MDBBtn
                        color="mdb-color"
                        rounded
                        className="float-right"
                        disabled={!this.checkSwap(2)}
                        onClick={this.handleNextPrevClick(2)(2)}
                      >
                        Weiter
                      </MDBBtn>
                  </MDBCol>
                )}
                {this.state.formActivePanel2 === 2 && (
                  <MDBCol md="6" className="m-auto">
                    <h3 className="font-weight-bold pl-0 my-4">
                      <strong>Kontaktdaten</strong>
                    </h3>
                    <div className="form-inline">
                      <MDBInput onClick={this.onClick(1)} checked={this.state.company.isCompany===false ? true : false} label="Privatperson"
                        type="radio" id="radio1" />
                      <MDBInput onClick={this.onClick(2)} checked={this.state.company.isCompany===true ? true : false} label="Unternehmen"
                        type="radio" id="radio2" />
                    </div>
                    {this.state.company.isCompany ? (
                      <div>
                        <div className="form-group">
                          <label htmlFor="formGroupExampleInput">UID-Nummer <span className="text-muted">(VAT)</span></label>
                          <input
                            value={ this.state.temp.vat }
                            type="text"
                            name="company_vat"
                            className= { this.state.vattemp === true ? 'form-control is-valid' : this.state.vattemp === false ? 'form-control is-invalid' : "form-control" }
                            onChange={ this.handleCompanyChange }
                          />
                          <small id="emailHelp" className="form-text text-muted">
                            Die UID-Nummer dient der Identifikation gegenüber anderen Unternehmen.
                          </small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="formGroupExampleInput">Firmenwortlaut <span className="text-muted">(Firmenname)</span><span className="deep-orange-text pl-1">*</span></label>
                          <Autosuggest 
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                            inputProps={inputProps}
                          />
                        </div>
                      </div>
                    ) : (
                      <span></span>
                    )}
                    <div className="form-group">
                          <label htmlFor="formGroupExampleInput">Adresse <span className="text-muted">(z.B. Musterstraße 7)</span><span className="deep-orange-text pl-1">*</span></label>
                          <input
                            value={ this.state.address.street }
                            type="text"
                            name="street"
                            className= "form-control"
                            onChange={ this.handleAddressChange }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <div className="form-row">
                            <div className="col">
                              <div>
                                <label htmlFor="formGroupExampleInput">Land<span className="deep-orange-text pl-1">*</span></label>
                                <select value={this.state.address.country} name="country" className="browser-default custom-select" onChange={ this.handleAddressChange } required>
                                  <option value="">Auswählen</option>
                                  <option value="AT">Österreich</option>
                                  <option value="DE">Deutschland</option>
                                  <option value="CH">Schweiz</option>
                                </select>
                              </div>
                            </div>
                             <div className="col">
                              <label htmlFor="formGroupExampleInput">Postleitzahl <span className="text-muted">(PLZ)</span><span className="deep-orange-text pl-1">*</span></label>
                              <input
                                value= { this.state.address.zip }
                                type="text"
                                name="zip"
                                className="form-control"
                                onChange={ this.handleAddressChange }
                                required
                              />
                            </div>
                            <div className="col-5">
                              <label htmlFor="formGroupExampleInput">Stadt<span className="deep-orange-text pl-1">*</span></label>
                              <input
                                value= { this.state.address.city }
                                type="text"
                                name="city"
                                className="form-control"
                                onChange={ this.handleAddressChange }
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <MDBBtn
                          color="mdb-color"
                          rounded
                          className="float-left"
                          onClick={this.handleNextPrevClick(2)(1)}
                        >
                          Zurück
                        </MDBBtn>
                        <MDBBtn
                          color="mdb-color"
                          rounded
                          className="float-right"
                          disabled={!this.checkSwap(3)}
                          onClick={this.handleNextPrevClick(2)(3)}
                        >
                          Weiter
                      </MDBBtn>
                  </MDBCol>
                )}
                {this.state.formActivePanel2 === 3 && (
                  <MDBCol md="12">
                    <h3 className="font-weight-bold pl-0 my-4">
                      <strong>Personalisierung</strong>
                    </h3>
                    <div className="text-center">
                      <label htmlFor="formGroupExampleInput">Wie wichtig ist { this.state.personalisation.informal ? (
                          "Dir"
                        ) : (
                          "Ihnen"
                        ) } eine persönliche Verbindung zu { this.state.personalisation.informal ? (
                          "Deinem"
                        ) : (
                          "Ihrem"
                        ) } Geschäfts-Partner?</label>
                      <MDBRow center>
                          <span className="font-weight-bold purple-text mr-2">Nicht wichtig</span>
                          <MDBRangeInput
                            name="connection"
                            getValue={this.handlePersonalisationSliderChange1}
                            min={0}
                            max={100}
                            value={this.state.personalisation.connection}
                            formClassName="w-50"
                          />
                          <span className="font-weight-bold purple-text ml-2">Sehr wichtig</span>
                      </MDBRow>
                    </div>
                    <MDBInput
                      label='Ich möchte mit "Du" angesprochen werden'
                      type="checkbox"
                      id="checkbox"
                      name="informal"
                      checked={ this.state.personalisation.informal }
                      onChange={ this.handlePersonalisationCheckboxChange }
                      autoFocus={this.calculateAutofocus(2)}
                    />
                    <MDBInput
                      label="Ich habe die Datenschutzerklärung gelesen und akzeptiere diese"
                      type="checkbox"
                      id="checkbox5"
                      name="gdpr"
                      checked={ this.state.personalisation.gdpr }
                      onChange={ this.handlePersonalisationCheckboxChange }
                    />
                    <MDBInput
                      label="Ich möchte Newsletters erhalten und von Sonderangeboten profitieren"
                      type="checkbox"
                      id="checkbox10"
                      name="newsletter"
                      checked={ this.state.personalisation.newsletter }
                      onChange={ this.handlePersonalisationCheckboxChange }
                    />
                    <MDBBtn
                      color="mdb-color"
                      rounded
                      className="float-left"
                      onClick={this.handleNextPrevClick(2)(2)}
                    >
                      Zurück
                    </MDBBtn>
                    <MDBBtn
                      color="success"
                      rounded
                      className="float-right"
                      onClick={this.handleNextPrevClick(2)(4)}
                    >
                      Starten
                    </MDBBtn>
                  </MDBCol>
                )}

                {this.state.formActivePanel2 === 4 && (
                  <MDBCol md="12">
                    <h3 className="font-weight-bold pl-0 my-4">
                      <strong>Glückwunsch!</strong>
                    </h3>
                    <h2 className="text-center font-weight-bold my-4">
                      Registrierung abgeschlossen!
                    </h2>
                    <p>Gleich starten und 10% beim ersten Auftrag sparen! { this.state.personalisation.informal ? ("Ziehe") : ("Ziehen Sie") } JETZT positiven Nutzen daraus.</p>
                  </MDBCol>
                )}
              </MDBRow>
            </div>
      </MDBContainer>
    );
  }
}

export default RegisterPage;
