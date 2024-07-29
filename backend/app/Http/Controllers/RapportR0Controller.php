<?php

namespace App\Http\Controllers;

use App\Http\Requests\RapportRequest;
use App\Models\Rapport_R0;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RapportR0Controller extends Controller
{
    public function index(Request $request)
    {
        $conducteur=$request->query('time');
        $dateOperation = $request->query('date_operation');
        $post = $request->query('post');
        $typeArret = $request->query('type_arret');
        $dateDebut = $request->query('date_debut');
        $dateFin = $request->query('date_fin');
        $nameArret = $request->query('nom_arret');
        $engin = $request->query('engin');
        $secteur = $request->query('secteur');
    
        $query = Rapport_R0::query();
        
        if ($conducteur) {
            $query->where('time_operation','like','%'.$conducteur.'%');
        }
        
        if ($nameArret) {
            $query->where('nom_arret', 'like', '%' . $nameArret . '%');
        }
    
        if ($dateOperation) {
            $query->where('date_operation', 'like', '%' . $dateOperation . '%');
        }
    
        if ($post) {
            $query->where('post', 'like', '%' . $post . '%');
        }
    
        if ($typeArret) {
            $query->where('type_arret', 'like', '%' . $typeArret . '%');
        }
    
        if ($dateDebut && $dateFin) {
            $query->whereBetween('date_operation', [$dateDebut, $dateFin]);
        }
    
        if ($engin) {
            $query->where('engin', 'like', '%' . $engin . '%');
        }
    
        if ($secteur) {
            $query->where('secteur', 'like', '%' . $secteur . '%');
        }
    
        $result = $query->get(); // Get filtered results
    
        // Check if result set is empty
        if ($result->isEmpty()) {
            return response()->json([
                'result' => [],
                'htp' => 0,
                'hc' => 0,
                'RD' => 0,
                'RF' => 0,
                'TD' => 0,
                'TU' => 0,
                'OEE' => 0,
                'heur_conteur_1er' => 0,
                'heur_conteur_2eme' => 0,
                'heur_conteur_3eme' => 0
            ]);
        }
    
        //--------------------------------------------------------------------------
        $heurConteur1er = $this->calculateHeurConteur(clone $query, '1er');
        $heurConteur2eme = $this->calculateHeurConteur(clone $query, '2eme');
        $heurConteur3eme = $this->calculateHeurConteur(clone $query, '3eme');
        $OEE = $this->OEE(clone $query, $post);
        $htp = $this->htp(clone $query,$post);
        $hc = $this->hc(clone $query);
        $t=$this->df_par_day(clone $query);
        $days=$this->days(clone $query);
        
        
        
        //----------------------------------------------------------------------------
        
        
    
        return response()->json([
            'TD' => $this->tdall(clone $query,$post),
            'TU' => $this->tuall(clone $query,$post),
            'test1'=>$this->df_par_day_post($query,$post),
            'test2'=>$this->all_htp_per_post_day(clone $query),
            'days'=>$days,
            'result' => $result,
            't'=>$t,
            'htp' => $htp,
            'hc' => $hc,
            'OEE' => $OEE,
            'heur_conteur_1er' => $heurConteur1er,
            'heur_conteur_2eme' => $heurConteur2eme,
            'heur_conteur_3eme' => $heurConteur3eme,
        ]);
    }

    private function calculateHeurConteur($query, $postValue)
    {   
        $dailyAverages = $query->select(DB::raw('date_operation,post, sum(df) as daily_avg'))
        ->where('post', $postValue)
        ->groupBy('post','date_operation')
        ->get();
        return $dailyAverages->sum('daily_avg');
        
    }

    private function OEE($query, $post)
    {
        $query1=clone $query;

        $days=$this->days(clone $query);
        $count=$days->count();

        if ($post==="1er") {
            $htp =$this->htp(clone $query1,"1er");
        }else if($post==="2eme"){
            $htp =$this->htp(clone $query1,"2eme");
        }else if($post==="3eme") {
            $htp =$this->htp(clone $query1,"3eme");
        } 
        $htp = $this->htp(clone $query1,null);
        $OEE = 100 * ($htp / ($post ? 8*$count : 24*$count));
        return $OEE;
    }



    
    private function tdall($query,$post){
        $days=$this->days(clone $query);
        $count=$days->count();
        if ($post==="1er") {
            $sum =$this->df_par_day_post(clone $query,"1er");
        }else if ($post==="2eme") {
            $sum =$this->df_par_day_post(clone $query,"2eme");
        }
        else if ($post==="3eme") {
            $sum =$this->df_par_day_post(clone $query,"3eme");
        }else{
            $sum =$this->calculate_Sum_per_day_df(clone $query);
        }
        
        $v=($post ?  8*$count  :    24*$count)-$sum;
        if ($count) {
            $td=$v/($post ? 8*$count :  24*$count);
            $td=$td*100;
            return $td;
        }
    }

    private function calculate_Sum_per_day_df($query)
    {
        $dailyAverages = $query->select(DB::raw('date_operation, sum(df) as daily_avg'))
        ->where('type_arret', 'materiel')                       
        ->groupBy('date_operation')
        ->get();
        return $dailyAverages->sum('daily_avg');
    }

    private function tuall($query, $post) {
        $days = $this->days(clone $query);
        $count = $days->count();
    
        if ($post === "1er") {
            $sum = $this->df_par_day_post(clone $query, "1er");
            $htp = $this->htp($query, "1er");
            
        } else if ($post === "2eme") {
            $sum = $this->df_par_day_post(clone $query, "2eme");
            $htp = $this->htp(clone $query, "2eme");
        } else if ($post === "3eme") {
            $sum = $this->df_par_day_post(clone $query, "3eme");
            $htp = $this->htp(clone $query, "3eme");
        } else {
            $htp = $this->htp(clone $query, null);
            $sum = $this->calculate_Sum_per_day_df(clone $query);
        }
    
        if ($count) {
            if ($sum == 0) {
                $v = ($post ? 8 * $count : 24 * $count);
            } else {
                $v = ($post ? 8 * $count : 24 * $count) - $sum;
            }
    
            if ($v) {
                $tu = 100 * ($htp / $v);
                return $tu;
            }
        }
        return 0;
    }
    
    
    
    private function calculate_Sum_htp_per_day_1er_post($query)
    {  
         // Subquery to calculate the daily averages for each post on each date_operation
         $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
         ->where('post','1er')
         ->groupBy('date_operation', 'post');
 
        // Query to calculate the sum of daily averages for each date_operation
        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
            ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
            ->groupBy('date_operation')
            ->mergeBindings($subQuery->getQuery()) // to include bindings
            ->get();
     return $result->sum('sum_of_daily_avg');
    }

    private function calculate_Sum_htp_per_day_2eme_post($query)
    {   
         // Subquery to calculate the daily averages for each post on each date_operation
         $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
         ->where('post','2eme')
         ->groupBy('date_operation', 'post');
        // Query to calculate the sum of daily averages for each date_operation
        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
            ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
            ->groupBy('date_operation')
            ->mergeBindings($subQuery->getQuery()) // to include bindings
            ->get();
 
     return $result->sum('sum_of_daily_avg');
    }

    private function calculate_Sum_htp_per_day_3eme_post($query)
    {  
         // Subquery to calculate the daily averages for each post on each date_operation
         $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
         ->where('post','3eme')
         ->groupBy('date_operation', 'post');
 
        // Query to calculate the sum of daily averages for each date_operation
        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
            ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
            ->groupBy('date_operation')
            ->mergeBindings($subQuery->getQuery()) // to include bindings
            ->get();
 
     return $result->sum('sum_of_daily_avg');
    }
    
    private function df_par_day($query)
    {
        $dailyAverages = $query->select(DB::raw('date_operation, sum(df) as df'))
                               ->where('type_arret','materiel')
                               ->groupBy('date_operation')
                               ->get();
        return $dailyAverages;
    }
    private function df_par_day_post($query,$post)
    {
        $dailyAverages = $query->select(DB::raw('post,date_operation, sum(df) as df'))
                               ->where('type_arret','materiel')
                               ->where('post',$post)
                               ->groupBy('date_operation','post')
                               ->get();
        return $dailyAverages->sum('df');
    }

    private function days($query){
        $days=$query->select(DB::raw('date_operation'))
                    ->groupBy('date_operation')
                    ->get();
        return $days;
    }
    
    private function htp($query,$post)
    {
        $htp=0;
        $hc = $this->hc(clone $query);
        $df_dpl_query = clone $query;
        $df_dpl = $df_dpl_query->where('nom_arret', 'Deplacement')->get();
        
            if ($post==="1er") {
                $htp =$this->calculate_Sum_htp_per_day_1er_post(clone $query);
            }else if($post==="2eme"){
                $htp =$this->calculate_Sum_htp_per_day_2eme_post(clone $query);
            }else if($post==="3eme") {
                $htp =$this->calculate_Sum_htp_per_day_3eme_post(clone $query);
            }

            $htp = $this->all_htp_per_post_day(clone $query);
            foreach ($df_dpl as $df) {
                $htp = $hc - $df->df;
            }
        
        return  $htp;
    }

    private function all_htp_per_post_day($query) {
        // Subquery to calculate the daily averages for each post on each date_operation
        $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
        ->groupBy('date_operation', 'post');
    
        // Query to calculate the sum of daily averages for each date_operation
        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
            ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
            ->groupBy('date_operation')
            ->mergeBindings($subQuery->getQuery()) // to include bindings
            ->get();
    
        return $result->sum('sum_of_daily_avg');
    }
    

    
    private function hc($query)
    {
        $subQuery = $query->select(DB::raw('date_operation, post, AVG(hc) as daily_avg'))
                          ->groupBy('date_operation', 'post');

        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
                    ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
                    ->groupBy('date_operation')
                    ->mergeBindings($subQuery->getQuery())
                    ->get();
        return $result->sum('sum_of_daily_avg');
    }


public function store(RapportRequest $request)
{
    $data = $request->validated();
    
    foreach ($data['data'] as $entry) {
        $entry['hc'] = $entry['f'] - $entry['d'];
        $entry['htp'] = $entry['hc'];
        $entry['date_operation']=$data['date_operation'];
        $entry['engin']=$data['engin'];
        $entry['secteur']=$data['secteur'];
        Rapport_R0::create($entry);
    }

    return response()->json(['message' => 'Data successfully stored'], 200);
}





    public function show(Rapport_R0 $newRapport)
    {
        return response()->json(['rapport' => $newRapport]);
    }

    public function update(RapportRequest $request, Rapport_R0 $newRapport)
    {
        $newRapport->update($request->validated());

        return response()->json(['rapport' => $newRapport, 'message' => 'Rapport updated successfully']);
    }

    public function destroy(Rapport_R0 $newRapport)
    {
        $newRapport->delete();

        return response()->json(['message' => 'Rapport deleted successfully']);
    }
}
