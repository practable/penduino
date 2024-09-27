<template>
<div class='container-fluid m-2 practable-component table'>
    <div class="row">
    <!-- <input type="text" id="search" v-on:keyup="search" v-model="search_field" placeholder="Search the table..."> -->

        <table v-for="table in tableData">
            <thead class='table-head'>
                <tr>
                    <th scope="col">Dataset</th>
                    <th scope="col">Time[s]</th>
                    <th scope="col">Angle[rad]</th>
                    <th scope="col">Angular Velocity[rad/s]</th>
                </tr>
            </thead>
            <tr v-for="row in table" :id="row.id" :key="row.id" v-bind:class="[row.id == selected_row_id ? 'selected-row' : '']" @click="changeSelected(row.id)">
                <td>{{row.set}}</td>
                <td>{{row.t.toFixed(2)}}</td>
                <td>{{row.theta.toFixed(2)}}</td>
                <td>{{row.omega.toFixed(2)}}</td>
            </tr>

            <!-- <tfoot class="table-head">
                <td><p></p></td>
            </tfoot> -->
                                
        </table> 

        <!-- If there is no current data stored then just display a table heading -->
        <table v-if="tableData.length == 0">
            <thead class='table-head'>
                <tr>
                    <th scope="col">Dataset</th>
                    <th scope="col">Time[s]</th>
                    <th scope="col">Angle[rad]</th>
                    <th scope="col">Angular Velocity[rad/s]</th>
                </tr>
            </thead>
        </table>

    </div>
</div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
    name: 'TableOutput',
    props:[
      'selected_point'
    ],
    data(){
        return{
            tableData: [],
            searchData:[],
            search_field:"",
            selected_row_id: "0",
        }
    },
    methods: {
        updateTable(){
            //this.tableData = [...this.getData];     //get a clone of the data, not set tableData to the getData getter
            this.tableData = [...this.getDataSets];
        },
    //     search(){
    //         if(this.search_field == ""){
    //             this.searchData = Array.from(this.tableData);
    //         } else{
    //             this.searchData = [];
    //             let d;
    //             let string_data_row;
    //             // Loop through all tableData, create a string of all elements in the table row, search if the current search_field text is contained and set hidden appropriately.
    //             for (let i = 0; i < this.tableData.length; i++) {
    //                 d = this.tableData[i];
    //                 string_data_row = d.id + d.mass + d.name + d.reclat + d.reclong + d.recclass;

    //                 if (string_data_row.toUpperCase().indexOf(this.search_field.toUpperCase()) > -1) {
    //                     this.searchData.push(d);
    //             }    else {
    //                     //tr[i].style.display = "none";
    //         }
        
    // }
    //         }
            
    //     },
        changeSelected(id){
            this.selected_row_id = id;
            //the selected row will be covered by the sticky table heading, so scroll to the element below
            let scroll_id = id - 1;
            var elmnt = document.getElementById(scroll_id);
            elmnt.scrollIntoView(); 
        }
      },
      computed:{
        ...mapGetters([
            'getIsRecording',
            'getData',
            'getDataSets'
        ])
      },
      watch:{
          //to clear data table on reset.
        getData(data){
            if(data.length == 0){
                this.updateTable();
            }
        },
        //to update table once recording complete
        getIsRecording(now, prev){
            if(!now && prev){
                this.updateTable();
            }
        },
        selected_point(id){
            this.changeSelected(id);
        }
      },
      mounted() {
        this.updateTable();
      },
      created(){
          
      }
}
</script>

<style scoped>

.selected-row{
    background-color: red;
    color: white;
}

</style>
