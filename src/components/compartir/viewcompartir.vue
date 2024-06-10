<template>
    <div>
        <ul class="w-full flex flex-col p-2 abso" v-if="listaElementos ">
                <div class="grid grid-cols-3 gap-4 p-4" v-for="(element, indice) in listaElementos" :key="indice">
                    <div class="relative "> 
                    <iframe v-if="element.tipo == 'application/pdf'" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover"/>
                    <img  v-if="element.tipo.startsWith('image/')" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover">
                </div>
                    <div class="text-center mt-2 overflow-hidden">
                        <h1 class="font-bold text-lg">{{ element.filename }}</h1>
                        <h3 class="text-gray-600">Fecha:{{ element.fecha }}</h3>
                        <h4 class="text-gray-600">{{ formatFileSize(element.tamaño_archivo) }}</h4>
                    </div>
                    <div class="grid grid-rows-3 gap-4 p-2 mt-2">
                        <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300" @click="eliminar(element)">Eliminar</button>
                        <button class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition duration-300" @click="descargar(element)">Descargar</button>
                    </div>
                    <hr class="col-span-3" />
                </div>
            </ul>    
            <h1 class=" text-4xl">
                Compartidos por grupos
            </h1>
            <ul class="w-full flex flex-col p-2 abso" v-if="listaElementos ">
                <div class="grid grid-cols-3 gap-4 p-4" v-for="(element, indice) in listacompartidosgrupo" :key="indice">
                    <div class="relative "> 
                    <iframe v-if="element.tipo == 'application/pdf'" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover"/>
                    <img  v-if="element.tipo.startsWith('image/')" :src="element.fileUrl" class="absolute inset-0 w-full h-full rounded-lg shadow-lg object-cover">
                </div>
                    <div class="text-center mt-2 overflow-hidden">
                        <h1 class="font-bold text-lg">{{ element.filename }}</h1>
                        <h3 class="text-gray-600">Fecha:{{ element.fecha }}</h3>
                        <h4 class="text-gray-600">{{ formatFileSize(element.tamaño_archivo) }}</h4>
                    </div>
                    <div class="grid grid-rows-3 gap-4 p-2 mt-2">
                        <button class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300" @click="eliminar(element)">Eliminar</button>
                        <button class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition duration-300" @click="descargar(element)">Descargar</button>
                    </div>
                    <hr class="col-span-3" />
                </div>
            </ul>    
    </div>
</template>

<script>

export default{
    data(){
        return{
        url: import.meta.env.VITE_BASE_URL,
        listaElementos: [],
        listacompartidosgrupo:[]
    }
    },
    mounted() {
            this.refreshFiles(),
            this.compartidosdelgrupo()
        },
    methods:{
        async refreshFiles(seccion) {
                const jwt = localStorage.getItem('jwtToken');
                const post={
                    "limit":5,
                    "off":(seccion!=1?(seccion-1)*5:0)
                }
                await fetch(this.url + '/share/shared', {
                    method: 'GET',
                    headers: {
                        "content-type": "application/json",
                        Authorization: jwt
                    },
                }).then(response => {
                    if (response.status == 200) {
                        response.json()
                            .then(async data => {
                                this.listaElementos = [];
                                 data.Response.forEach(async(element) => {
                                    const fecha=new Date(element.fecha);
                                    const diferenciaHorariaColombia = -5 * 60 * 60 * 1000;
                                    const fecha_colombia =new Date(fecha.getTime()+diferenciaHorariaColombia);
                                    element.fecha=fecha_colombia.toLocaleDateString()+"\n"+fecha_colombia.toLocaleTimeString();
                                    const fileId = element.i_dfile; 
                                    const url = `${this.url}/files/getfile/${fileId}`;
                                    const token = localStorage.getItem("jwtToken");
                                    if(element.tipo.startsWith('image/') || element.tipo=='application/pdf'){

                                    try {
                                        const response =await fetch(url, {
                                        method: "POST",
                                        headers: {
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body:JSON.stringify({user_id:element.id_user})
                                        });
                                        if (response.ok) {
                                            const blob =  await response.blob();
                                            const fileUrl = URL.createObjectURL(blob);
                                            element.fileUrl =fileUrl;
                                        } else {
                                        console.error("Error al obtener el archivo:", response);
                                        }
                                    } catch (error) {
                                        console.error("Error al hacer la solicitud:", error);
                                    }   }
                                    this.listaElementos.push(element);
                        });
                            })
                    }
                    if (response.status == 401) {
                        return;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            eliminar(element) {
                const jwt = localStorage.getItem('jwtToken');
                const data = {
                    id_share: element.id_share_files,
                };
                fetch(this.url + '/share/rmshare', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json', // Indica el tipo de contenido del cuerpo (JSON en este caso)
                        Authorization: jwt,
                    },
                    body: JSON.stringify(data) // Convierte el objeto a JSON antes de enviarlo en el cuerpo
                }).then(response => {
                    if (
                        response.status === 200) {
                        this.refreshFiles();
                    }
                });
            },
            async descargar(element){
                const fileId = element.i_dfile; 
                const token = localStorage.getItem('jwtToken');
                const url = `${this.url}/files/getfile/${fileId}`;
                try {
                    const response =await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body:JSON.stringify({user_id:element.id_user})
                    });
                    if (response.ok) {
                        const blob =  await response.blob();
                        const fileUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href=fileUrl;
                        a.download = element.filename;
                        a.click();
                    } else {
                    console.error("Error al obtener el archivo:", response);
                    }
                } catch (error) {
                    console.error("Error al hacer la solicitud:", error);
                }   
  
            },
            formatFileSize(bytes) {
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes === 0) return '0 Bytes';

                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                const value = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
                
                return `${value} ${sizes[i]}`;
                    },
            compartidosdelgrupo(){

                try {
                const jwt = localStorage.getItem('jwtToken');
                    fetch(this.url + '/groups/compartidos', {
                        method: 'GET',
                        headers: {
                            "content-type": "application/json",
                            Authorization: jwt
                        },
                    }).then((response)=>{
                        response.json().then(response=>{
                            response.Response.forEach(async(element) => {
                                    const fecha=new Date(element.fecha);
                                    const diferenciaHorariaColombia = -5 * 60 * 60 * 1000;
                                    const fecha_colombia =new Date(fecha.getTime()+diferenciaHorariaColombia);
                                    element.fecha=fecha_colombia.toLocaleDateString()+"\n"+fecha_colombia.toLocaleTimeString();
                                    const fileId = element.i_dfile; 
                                    const url = `${this.url}/files/getfile/${fileId}`;
                                    const token = localStorage.getItem("jwtToken");
                                    if(element.tipo.startsWith('image/') || element.tipo=='application/pdf'){

                                    try {
                                        const response =await fetch(url, {
                                        method: "POST",
                                        headers: {
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body:JSON.stringify({user_id:element.id_user})
                                        });
                                        if (response.ok) {
                                            const blob =  await response.blob();
                                            const fileUrl = URL.createObjectURL(blob);
                                            element.fileUrl =fileUrl;
                                        } else {
                                        console.error("Error al obtener el archivo:", response);
                                        }
                                    } catch (error) {
                                        console.error("Error al hacer la solicitud:", error);
                                    }                         
                                }
                                          this.listacompartidosgrupo.push(element);
                                    });
                    
                        })})
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            
            }
    }
}
</script>

