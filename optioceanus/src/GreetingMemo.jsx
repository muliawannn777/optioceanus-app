import React from "react";

function Greeting( {name }) {
    console.log(`Greeting untuk ${name} dirender`);
    return <h1>Halo, {name}!</h1>
}

const MemoizedGreeting = React.memo(function GreetingMemo({ name }) {
    console.log(`MemoizedGreeting untuk ${name} dirender`);
    return <h1>Halo (Memoized), {name}!</h1>
});

export default MemoizedGreeting;