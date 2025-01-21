/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        isActive: true,
        balance: 500,
        message: "500 bonus deposit from us on opening new account",
        messageType: "success",
      };
    case "deposit":
      return {
        ...state,
        balance: state.balance + 150,
        message: "You balance has been updated with a credit of 150",
        messageType: "success",
      };
    case "withdraw":
      return {
        ...state,
        balance: state.balance - 50,
        message: "Your balance amount has been debited by 50",
        messageType: "error",
      };
    case "requestLoan":
      if (state.loan !== 0)
        return {
          ...state,
          message: "You already have a loan!!",
          messageType: "warning",
        };
      return {
        ...state,
        loan: 5000,
        balance: state.balance + 5000,
        message: "Loan of 5000 has been credited to your account",
        messageType: "success",
      };
    case "payLoan":
      return {
        ...state,
        loan: 0,
        balance: state.balance - 5000,
        message: "Loan of 5000 has been debited from your account",
        messageType: "warning",
      };
    case "closeAccount":
      if (state.loan !== 0)
        return {
          ...state,
          message: "You have a pending loan!!",
          messageType: "warning",
        };
      if (state.balance < 0)
        return {
          ...state,
          message: "You can't close an account with negative balance!!",
          messageType: "warning",
        };
      return {
        ...state,
        balance: 0,
        loan: 0,
        isActive: false,
        message: "Your account has been closed!",
        messageType: "info",
      };
    default:
      return state;
  }
}

export default function App() {
  const defaultMessage = "Open account to do transactions!!";
  const initialState = {
    balance: 0,
    loan: 0,
    isActive: false,
    message: defaultMessage,
    messageType: "info",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { balance, loan, isActive, message, messageType } = state;

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "openAccount" });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "deposit" });
          }}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "withdraw" });
          }}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "requestLoan" });
          }}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "payLoan" });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "closeAccount" });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>

      {message && (
        <p>
          Message:{" "}
          <em>
            <strong className={messageType}>{message}</strong>
          </em>
        </p>
      )}
    </div>
  );
}
