<?php

namespace App\Http\Controllers;


use App\Models\Rapport_R0;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Metrics extends Controller
{
    public function calculateMetricsPerDay(Request $request)
    {
        $query = Rapport_R0::query();

        $dateDebut = $request->query('date_debut');
        $dateFin = $request->query('date_fin');
        $dateOperation = $request->query('date_operation');
        
        if ($dateOperation) {
            $query->where('date_operation', 'like', '%' . $dateOperation . '%');
        }
        
        if ($dateDebut && $dateFin) {
            $query->whereBetween('date_operation', [$dateDebut, $dateFin]);
        }

        $groupedByDate = $query->select(DB::raw('date_operation'))
                               ->groupBy('date_operation')
                               ->get();
        $table = $this->table(clone $query);

        // Sort the table by date_operation
        $table = $table->sortBy('date_operation')->values()->all();

        $metrics = [];

        foreach ($groupedByDate as $group) {
            $date = $group->date_operation;
            $dailyQuery = clone $query;
            $dailyQuery->where('date_operation', $date);

            $heurConteur1er = $this->calculateHeurConteur(clone $dailyQuery, '1er');
            $heurConteur2eme = $this->calculateHeurConteur(clone $dailyQuery, '2eme');
            $heurConteur3eme = $this->calculateHeurConteur(clone $dailyQuery, '3eme');

            // Binary search for the date in the table
            $index = $this->binarySearch($table, $date);

            if ($index !== -1) {
                $t = $table[$index];
                $v = $t->htp;
                $OEE = $this->OEE($v);
                $TU = $this->TU(clone $query, $v, $date);
            } else {
                $OEE = null;
                $TU = null;
            }

            $TD = $this->TD(clone $dailyQuery);
            $htp = $this->htp(clone $dailyQuery);
            $hc = $this->hc(clone $dailyQuery);

            $metrics[] = [
                'days' => $this->df_par_day(clone $dailyQuery),
                'date_operation' => $date,
                'htp' => $htp,
                'hc' => $hc,
                'TD' => $TD,
                'TU' => $TU,
                'OEE' => $OEE,
                'heur_conteur_1er' => $heurConteur1er,
                'heur_conteur_2eme' => $heurConteur2eme,
                'heur_conteur_3eme' => $heurConteur3eme
            ];
        }

        return response()->json(['metrics' => $metrics]);
    }

    private function calculateHeurConteur($query, $postValue)
    {
        $dailyAverages = $query->select(DB::raw('date_operation, post, sum(df) as daily_avg'))
                               ->where('post', $postValue)
                               ->groupBy('post', 'date_operation')
                               ->get();
        return $dailyAverages->sum('daily_avg');
    }

    private function OEE($htp)
    {
        return 100 * ($htp / 24);
    }
    
    private function TD($query)
    {
        $t = $this->df_par_day(clone $query);
        $v = 24 - $t;
        $TD = 100 * ($v / 24);
        return $TD;
    }

    private function TU($query, $htp, $date)
    {
        $df = 0;

        $table = $this->df(clone $query);
        $index = $this->binarySearch($table, $date);
        
        if ($index !== -1) {
            $df = $table[$index]->daily_avg;
        }
        
        $v = 24 - $df;
        if ($htp != 0) {
            $TU = $htp / $v;
            return $TU * 100;
        }
        return null; // Return null if TU cannot be calculated
    }
    
    private function df_par_day($query)
    {
        $dailyAverages = $query->select(DB::raw('date_operation, sum(df) as daily_avg'))
        ->where('type_arret', 'materiel')                       
        ->groupBy('date_operation')
        ->get();
        return $dailyAverages->sum('daily_avg');
    }

    private function df($query)
    {
        $dailyAverages = $query->select(DB::raw('date_operation, sum(df) as daily_avg'))
        ->where('type_arret', 'materiel')                       
        ->groupBy('date_operation')
        ->get();
        return $dailyAverages;
    }

    private function htp($query)
    {
        $hc = $this->hc($query);
        $df_dpl_query = clone $query;
        $df_dpl = $df_dpl_query->where('nom_arret', 'Deplacement')->get();
        $htp = $this->all_htp_per_post_day($query);

        foreach ($df_dpl as $df) {
            $htp = $hc - $df->df;
        }
        return $htp;
    }

    private function all_htp_per_post_day($query)
    {
        $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
        ->where('htp', '!=', 0)                    
        ->groupBy('date_operation', 'post');

        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
                    ->select(DB::raw('date_operation, SUM(daily_avg) as sum_of_daily_avg'))
                    ->groupBy('date_operation')
                    ->mergeBindings($subQuery->getQuery())
                    ->get();
        return $result->sum('sum_of_daily_avg');
    }

    private function table($query)
    {
        $subQuery = $query->select(DB::raw('date_operation, post, AVG(htp) as daily_avg'))
        ->where('htp', '!=', 0)                    
        ->groupBy('date_operation', 'post');

        $result = DB::table(DB::raw("({$subQuery->toSql()}) as avg_table"))
                    ->select(DB::raw('date_operation, SUM(daily_avg) as htp'))
                    ->groupBy('date_operation')
                    ->mergeBindings($subQuery->getQuery())
                    ->get();
        return $result;
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

    // Binary search function
    private function binarySearch($table, $date)
    {
        $left = 0;
        $right = count($table) - 1;

        while ($left <= $right) {
            $mid = intdiv($left + $right, 2);
            $midDate = $table[$mid]->date_operation;

            if ($midDate == $date) {
                return $mid; // Return index of the found element
            } elseif ($midDate < $date) {
                $left = $mid + 1;
            } else {
                $right = $mid - 1;
            }
        }

        return -1; // Return -1 if the element is not found
    }
}
