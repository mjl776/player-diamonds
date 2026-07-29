"use client";

import { FC } from "react";
import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { LoginState } from "@/types/loginTypes";
import styles from "./page.module.css";

export const LoginForm: FC<{ from: string }> = ({ from }) => {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className={styles.container}>
      <form className={styles.card} action={action}>
        <div className={styles.header}>Player Diamonds</div>
        <p className={styles.subheader}>This app is password protected.</p>
        <input type="hidden" name="from" value={from} />
        <input
          className={styles.input}
          type="password"
          name="password"
          autoFocus
          placeholder="Password"
        />
        {state?.error && <p className={styles.error}>{state.error}</p>}
        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
};
