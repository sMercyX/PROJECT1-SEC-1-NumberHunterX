<script setup>

</script>
 
<template>
    <div>
        <div class=" min-h-screen flex flex-col justify-center items-center">
            <h1 class="text-4xl text-black mb-8">NUMBER HUNTER</h1>
            <div class="box-wrapper">
                <div class="box flex flex-col md:flex-row items-center justify-center py-8 md:py-12">
                    <div class="md:w-1/2 mb-4 md:mb-0 md:mr-4 mx-3">
                        <img src="./assets/t1-1.png" alt="Game Image" class="w-full h-auto ">
                    </div>
                    <div class="md:w-1/2 flex flex-col items-center justify-center">
                        <div class="text-lg text-black text-justify mb-4 md:mb-8 p-6">Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Tenetur deserunt asperiores vitae molestiae unde, illo aut suscipit voluptates impedit
                            voluptatem expedita aperiam libero dolorum porro cumque accusantium error magnam eaque!</div>

                    </div>
                    <div class="button-group self-start md:self-end flex flex-row  md:flex-col mr-2" >
                        <button class="btn btn-primary mb-2 m-3">previous page</button>
                        
                        <button class="btn btn-primary mb-2 m-3">next page</button>
                    </div>
                </div>
            </div>
            <div class="p-5">
              <button class="btn btn-secondary mt-4 ">Home</button>  
            </div>
            

        </div>

    </div>
</template>
 
<script>
export default {
    name: 'HomePage'
}
</script>

<style scoped>

.box-wrapper {
    max-width: 800px;
}

.box {
    background-color: #ffffff;
    /* White background */
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.btn {
    border-radius: 999px;
    width: 90% ;
    margin-top: 3%;
}
</style>
