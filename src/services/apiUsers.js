const url =import.meta.env.VITE_BASE_URL;
export default{
    async _login(data) {
        try {
          const response=await fetch(url + "/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)});
            console.log(response);
            if (response.status == 200) {
              const result =response.json();
              return result;
            }
            else{
                return "error";
            }

        } catch (error) {
          return error;
        }
      }
}