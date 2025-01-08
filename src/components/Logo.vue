<template>
    <div class="logo" :class="{ 'is-startpage': isStartPage}">
        Häng Person
    </div>
</template>

<script>
export default {
    name: "Logo", 
    props: {
        isStartPage: {
            type: Boolean, 
            default: false, 
        }, 
    }, 
};
</script>

<style scoped>
.logo {
    font-family: 'Sue Ellen Francisco', cursive;
    text-transform: uppercase; 
    letter-spacing: 0.1em;
    font-size: 2em;
    color: rgb(4, 16, 131); 
    position: absolute; 
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    /*margin: 1rem auto; */
    text-align: center; 
}

.logo.is-startpage {
    font-size: 5rem; 
    padding-top: 2rem;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>