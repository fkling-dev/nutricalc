var farbe_ok="#f9f9f9";
var farbe_fehler="#ffd4dd";
var angabe_nachkommastellen_zahlenpruefung=1;

function Wert_Pruefen(eingabefeld,minimum,maximum,name_prs_feld,pruefungsstufe){
    var wert_zu_pruefen=$(eingabefeld).val();
    wert_zu_pruefen=Number.parseFloat(wert_zu_pruefen).toFixed(angabe_nachkommastellen_zahlenpruefung);
    if(wert_zu_pruefen<=maximum&&wert_zu_pruefen>=minimum)
    {
        $(eingabefeld).css("background-color",farbe_ok);
        $("input[name="+name_prs_feld+"]").val(wert_zu_pruefen);
        stufenberechnung_pruefen(pruefungsstufe)
        $("#fehler_"+name_prs_feld).css("display","none");
    }
    else
    {
        $(eingabefeld).css("background-color",farbe_fehler);
        if($("input[name="+name_prs_feld+"]").val()!="")
        {
            $("#fehler_"+name_prs_feld).html("Berechnungen erfolgen mit dem letzten gültigen Wert: <b>"+$("input[name="+name_prs_feld+"]").val()+"</b>");
            $("#fehler_"+name_prs_feld).css("display","block");
        }
        //$("input[name="+name_prs_feld+"]").val('');
    }
}

function stufenberechnung_pruefen(stufe){
    if(stufe==1)
    {
        var prs_gewicht_kg=$("input[name=prs_gewicht_kg]").val();
        var prs_groesse_cm=$("input[name=prs_groesse_cm]").val();
        if(prs_gewicht_kg!=""&&!isNaN(prs_gewicht_kg)&&prs_groesse_cm!=""&&!isNaN(prs_groesse_cm))
        {
            berechne_stufe_1(prs_gewicht_kg,prs_groesse_cm);
            $("#rm_berechnungsstufe_"+stufe).html("BMI: "+$("input[name=prs_bmi]").val()+"kg/m<sup>2</sup> &bull; IBW: "+$("input[name=prs_ibw_kg]").val()+"kg &bull; KOF: "+$("input[name=prs_kof]").val()+"m<sup>2</sup><div class='zahlenkreis zahlenkreis_gr2'>9</div>");
            if($("#kaloriengrundlage option:selected").val()=="metrik"){stufenberechnung_pruefen(3);}
            else if($("#kaloriengrundlage option:selected").val()=="kaloriemetrie"){stufenberechnung_pruefen(4);}
        }
    }

    if(stufe==2)
    {
        var df_mlph=parseInt($("input[name=prs_df_mlph]").val());
        if(df_mlph!=""&&!isNaN(df_mlph)){
            berechne_stufe_2();
            var crrt_name=$("#crrt option:selected").val();
            var crrt_ersatzname="";
            if(crrt_name=="cvvhd"){crrt_ersatzname="CVVHD";} if(crrt_name=="cvvh"){crrt_ersatzname="CVVH";}
            $("#rm_berechnungsstufe_"+stufe).html("AS-Verlust durch "+crrt_ersatzname+": "+$("input[name=crrt_as_g]").val()+" g<div class='zahlenkreis zahlenkreis_gr2'>10</div>");
        }
    }

    if(stufe==3)
    {
        var kcal_rel_bmi0=parseInt($("input[name=prs_kcal_rel_bmi0]").val());
        var kcal_rel_bmi1=parseInt($("input[name=prs_kcal_rel_bmi1]").val());
        var kcal_rel_bmi2=parseInt($("input[name=prs_kcal_rel_bmi2]").val());
        var as_rel_bmi1=$("input[name=prs_as_rel_bmi1_g]").val();
        var prs_gewicht_kg=$("input[name=prs_gewicht_kg]").val();
        var prs_groesse_cm=$("input[name=prs_groesse_cm]").val();

        if(prs_gewicht_kg!=""&&!isNaN(prs_gewicht_kg)&&prs_groesse_cm!=""&&!isNaN(prs_groesse_cm))
        {
            bmigruppe=$("input[name=prs_bmigruppe]").val();
            
            if(bmigruppe=="bmi0")
            {
                // ------ Reset der nicht verwendeten BMI-Gruppe (User interface) -----
                $("#rm_berechnungsstufe_bmi0").html('Angaben vervollständigen');
                $("#rm_berechnungsstufe_bmi1").html('Andere BMI-Gruppe in Verwendung');
                $("#rm_berechnungsstufe_bmi2").html('Andere BMI-Gruppe in Verwendung');
                // ------ Ende Reset der nicht verwendeten BMI-Gruppe (User interface) -----

                if(kcal_rel_bmi0!=""&&!isNaN(kcal_rel_bmi0)){berechne_stufe_3(bmigruppe);$("#rm_berechnungsstufe_"+bmigruppe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal");}
            }
            if(bmigruppe=="bmi1")
            {
                // ------ Reset der nicht verwendeten BMI-Gruppe (User interface) -----
                $("#rm_berechnungsstufe_bmi1").html('Angaben vervollständigen');
                $("#rm_berechnungsstufe_bmi0").html('Andere BMI-Gruppe in Verwendung');
                $("#rm_berechnungsstufe_bmi2").html('Andere BMI-Gruppe in Verwendung');
                // ------ Ende Reset der nicht verwendeten BMI-Gruppe (User interface) -----

                if(kcal_rel_bmi1!=""&&!isNaN(kcal_rel_bmi1)&&as_rel_bmi1!=""&&!isNaN(as_rel_bmi1)){
                    berechne_stufe_3(bmigruppe);
                    $("#rm_berechnungsstufe_"+bmigruppe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal mit "+$("input[name=prs_as_rel_bmi1_g]").val()+" g/kg IBW AS");
                }
            }
            if(bmigruppe=="bmi2")
            {
                // ------ Reset der nicht verwendeten BMI-Gruppe (User interface) -----
                $("#rm_berechnungsstufe_bmi2").html('Angaben vervollständigen');
                $("#rm_berechnungsstufe_bmi1").html('Andere BMI-Gruppe in Verwendung');
                $("#rm_berechnungsstufe_bmi0").html('Andere BMI-Gruppe in Verwendung');
                // ------ Ende Reset der nicht verwendeten BMI-Gruppe (User interface) -----

                if(kcal_rel_bmi2!=""&&!isNaN(kcal_rel_bmi2)){berechne_stufe_3(bmigruppe); $("#rm_berechnungsstufe_"+bmigruppe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal");}
            }
        }
    }
    
    if(stufe==4)
    {
        var kaloriemetrie_modus=$("#kaloriemetrie_modus option:selected").val();
        var resp_kcal=parseFloat($("input[name=prs_ree_kcal]").val());
        var ecmo_bf=parseFloat($("input[name=prs_ecmo_bf]").val());
        var ecmo_sao2=parseFloat($("input[name=prs_ecmo_sao2]").val());
        var ecmo_svo2=parseFloat($("input[name=prs_ecmo_svo2]").val());
        var ecmo_hb=parseFloat($("input[name=prs_ecmo_hb]").val());
        var ecmo_luftdruck=parseFloat($("input[name=prs_ecmo_luftdruck_hpa]").val());
        var kaloriemetrie_faktor=parseFloat($("input[name=prs_kaloriemetrie_faktor]").val());
        var bmigruppe_autoselect=$("input[name=bmi_gruppe_autoselect]").val();
        var bmi1_as=parseFloat($("input[name=prs_as_rel_bmi1_g]").val());
        
        if(kaloriemetrie_modus=="resp")
        {
            if(!isNaN(resp_kcal)&&!isNaN(kaloriemetrie_faktor))
            {
                if(bmigruppe_autoselect=="bmi1"){
                    if(!isNaN(bmi1_as)&&bmi1_as!=""){
                        berechne_stufe_4("resp");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal + "+bmi1_as+" g/kg IBW AS");
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Angaben vervollständigen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }

                else if(bmigruppe_autoselect!="bmi1"){
                    if(bmigruppe_autoselect=="bmi0"||bmigruppe_autoselect=="bmi2"){
                        berechne_stufe_4("resp");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal"); 
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Basischarakteristika ergänzen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }
            }
        }

        if(kaloriemetrie_modus=="ecmo"){
            if(!isNaN(ecmo_bf)&&!isNaN(ecmo_sao2)&&!isNaN(ecmo_svo2)&&!isNaN(ecmo_hb)&&!isNaN(ecmo_luftdruck)&&!isNaN(kaloriemetrie_faktor))
            {
                if(bmigruppe_autoselect=="bmi1"){
                    if(!isNaN(bmi1_as)&&bmi1_as!=""){
                        berechne_stufe_4("ecmo");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal + "+bmi1_as+" g/kg IBW AS");
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Angaben vervollständigen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }

                else if(bmigruppe_autoselect!="bmi1"){
                    if(bmigruppe_autoselect=="bmi0"||bmigruppe_autoselect=="bmi2"){
                        berechne_stufe_4("ecmo");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal"); 
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Basischarakteristika ergänzen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }
            }
        }

        if(kaloriemetrie_modus=="resp_ecmo"){
            if(!isNaN(resp_kcal)&&!isNaN(kaloriemetrie_faktor)&&!isNaN(ecmo_bf)&&!isNaN(ecmo_sao2)&&!isNaN(ecmo_svo2)&&!isNaN(ecmo_hb)&&!isNaN(ecmo_luftdruck)&&!isNaN(kaloriemetrie_faktor))
            {
                if(bmigruppe_autoselect=="bmi1"){
                    if(!isNaN(bmi1_as)&&bmi1_as!=""){
                        berechne_stufe_4("resp_ecmo");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal + "+bmi1_as+" g/kg IBW AS");
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Angaben vervollständigen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }

                else if(bmigruppe_autoselect!="bmi1"){
                    if(bmigruppe_autoselect=="bmi0"||bmigruppe_autoselect=="bmi2"){
                        berechne_stufe_4("resp_ecmo");
                        $("#rm_berechnungsstufe_"+stufe).html("Kalorienziel: "+$("input[name=kcal_abs]").val()+" kcal"); 
                    }
                    else{
                        $("#rm_berechnungsstufe_"+stufe).html("Basischarakteristika ergänzen");
                        angaben_entfernen("ergebnistabelle");
                    }
                }
            }
        } 

    }

    if(stufe==5){
        var kcal_abs=parseFloat($("input[name=kcal_abs]").val());
        var ibw=parseFloat($("input[name=kcal_abs]").val());
        var bmigruppe=$("input[name=prs_bmigruppe]").val();
        var bmi1_as=parseFloat($("input[name=prs_as_rel_bmi1_g]").val());

        if(!isNaN(kcal_abs)&&!isNaN(ibw)){
            if(bmigruppe!="bmi1")
            {
                berechne_stufe_5();
                $("#ergebnisbereich").css("opacity","100%");
            }
            else if(bmigruppe=="bmi1"){
                if(!isNaN(bmi1_as)){
                    berechne_stufe_5();
                    $("#ergebnisbereich").css("opacity","100%");
                }
            }
            else{

            }
        }
        else{
            $("#ergebnisbereich").css("opacity","30%");
            $("#ergebnisbereich_hinweis").html('')
            $("#ergebnis_as_ges_g").val('');
            $("#ergebnis_as_crrt_g").val('');
            $("#ergebnis_fett_g").val('');
            $("#ergebnis_glukose_g").val('');
            $("#ergebnis_kcal_abs").val('');
        }
    }
}

function berechne_stufe_1(prs_gewicht_kg,prs_groesse_cm)
{
        // ------------ BMI -------------------
        var bmi=prs_gewicht_kg/(Math.pow((prs_groesse_cm/100),2))
        $("input[name=prs_bmi]").val(bmi.toFixed(angabe_nachkommastellen_zahlenpruefung));
        
        // ------------ BMI-Gruppe -------------------
        if(bmi<30)
        {
            $("input[name=bmi_gruppe_autoselect]").val("bmi0");
            if($("#bmigruppe option:selected").val()=="autoselect")
            {
                $("input[name=prs_bmigruppe]").val("bmi0")
            }
            else{$("input[name=prs_bmigruppe]").val($("#bmigruppe option:selected").val())}
        }
        if(bmi>=30&&bmi<=50)
        {
            $("input[name=bmi_gruppe_autoselect]").val("bmi1");
            if($("#bmigruppe option:selected").val()=="autoselect")
            {
                $("input[name=prs_bmigruppe]").val("bmi1")
            }
            else{$("input[name=prs_bmigruppe]").val($("#bmigruppe option:selected").val())}
        }
        if(bmi>50)
        {
            $("input[name=bmi_gruppe_autoselect]").val("bmi2");
            if($("#bmigruppe option:selected").val()=="autoselect")
            {
                $("input[name=prs_bmigruppe]").val("bmi2")
            }
            else{$("input[name=prs_bmigruppe]").val($("#bmigruppe option:selected").val())}
        }

        // ------------- Richtige Kalorienvorgabe-Box automatisch einblenden nach prs_bmigruppe
        if($("#kaloriengrundlage option:selected").val()=="metrik"){
            var bmigruppe_ist=$("input[name=prs_bmigruppe]").val();
            if(bmigruppe_ist=="bmi0"){$("#box_bmi0").css("display","block"); $("#box_bmi1").css("display","none");$("#box_bmi2").css("display","none");}
            if(bmigruppe_ist=="bmi1"){$("#box_bmi0").css("display","none"); $("#box_bmi1").css("display","block");$("#box_bmi2").css("display","none");}
            if(bmigruppe_ist=="bmi2"){$("#box_bmi0").css("display","none"); $("#box_bmi1").css("display","none");$("#box_bmi2").css("display","block");}
        }

        if($("#kaloriengrundlage option:selected").val()=="kaloriemetrie"){
            var bmigruppe_autoselect=$("input[name=bmi_gruppe_autoselect]").val();
            if(bmigruppe_autoselect=="bmi1"){$("#wrapper_kaloriemetrie_as_bmi1").css("display","block");}
            else{$("#wrapper_kaloriemetrie_as_bmi1").css("display","none")}
            stufenberechnung_pruefen(4);
        }
        
        // IBW
        var ibw;
        if($("#geschlecht option:selected").val()=="m"){ibw=23*(Math.pow((prs_groesse_cm/100),2))}
        if($("#geschlecht option:selected").val()=="w"){ibw=21.5*(Math.pow((prs_groesse_cm/100),2))}
        $("input[name=prs_ibw_kg]").val(ibw.toFixed(angabe_nachkommastellen_zahlenpruefung));

        // KOF
        var kof;
        kof=Math.pow((prs_groesse_cm*(prs_gewicht_kg/3600)),0.5);
        $("input[name=prs_kof]").val(kof.toFixed(angabe_nachkommastellen_zahlenpruefung));

    angaben_entfernen("ergebnistabelle");    
    stufenberechnung_pruefen(5);
}

function berechne_stufe_2(){
    var crrt_as=0;
    var crrt_auswahl_selected=$("#crrt option:selected").val();
    var crrt_df_mlph=parseInt($("input[name=prs_df_mlph]").val());
    
    if(crrt_auswahl_selected=="cvvhd"){crrt_as=0.6*((crrt_df_mlph*24)/1000);}
    if(crrt_auswahl_selected=="cvvh"){crrt_as=0.2*((crrt_df_mlph*24)/1000);}
   
    $("input[name=crrt_as_g]").val(crrt_as.toFixed(angabe_nachkommastellen_zahlenpruefung));

    stufenberechnung_pruefen(5);
}

function berechne_stufe_3(bmigruppe){
    var kcal_abs=0;
    var prs_gewicht_kg=$("input[name=prs_gewicht_kg]").val();
    var prs_ibw_kg=$("input[name=prs_ibw_kg]").val();

    if(bmigruppe=="bmi0"){
        var kcal_rel_bmi0=$("input[name=prs_kcal_rel_bmi0]").val();
        kcal_abs=kcal_rel_bmi0*prs_gewicht_kg;
        $("input[name=kcal_abs]").val(kcal_abs.toFixed(0));
    }

    if(bmigruppe=="bmi1"){
        var kcal_rel_bmi1=$("input[name=prs_kcal_rel_bmi1]").val();
        kcal_abs=kcal_rel_bmi1*prs_gewicht_kg;
        $("input[name=kcal_abs]").val(kcal_abs.toFixed(0));
    }

    if(bmigruppe=="bmi2"){
        var kcal_rel_bmi2=$("input[name=prs_kcal_rel_bmi2]").val();
        kcal_abs=kcal_rel_bmi2*prs_ibw_kg;
        $("input[name=kcal_abs]").val(kcal_abs.toFixed(0));
    }

    stufenberechnung_pruefen(5);
}

function berechne_stufe_4(kaloriemetrie_modus){
    var kcal_gesamt=0;
    var resp_kcal=parseFloat($("input[name=prs_ree_kcal]").val());
    var ecmo_bf=parseFloat($("input[name=prs_ecmo_bf]").val());
    var ecmo_sao2=parseFloat($("input[name=prs_ecmo_sao2]").val());
    var ecmo_svo2=parseFloat($("input[name=prs_ecmo_svo2]").val());
    var ecmo_hb=parseFloat($("input[name=prs_ecmo_hb]").val());
    var ecmo_luftdruck=parseFloat($("input[name=prs_ecmo_luftdruck_hpa]").val());
    var kaloriemetrie_faktor=parseFloat($("input[name=prs_kaloriemetrie_faktor]").val());

    if(kaloriemetrie_modus=="resp"){
        kcal_gesamt=resp_kcal*(kaloriemetrie_faktor/100);
        $("input[name=ee_total]").val(resp_kcal.toFixed(0));
        $("input[name=kcal_abs]").val(kcal_gesamt.toFixed(0));
    }

    if(kaloriemetrie_modus=="ecmo"){
        var luftdruck_mmhg=ecmo_luftdruck*0.75;
        var vo2=0.134*(ecmo_bf*(ecmo_sao2-ecmo_svo2)*ecmo_hb);
        var vco2=((28/luftdruck_mmhg)*ecmo_bf*1000);
        var ecmo_kcal=((3.9*vo2)+(1.1*vco2))*1.44;
        kcal_gesamt=ecmo_kcal*(kaloriemetrie_faktor/100);

        $("input[name=ecmo_vo2]").val(vo2.toFixed(0));
        $("input[name=ecmo_vco2]").val(vco2.toFixed(0));
        $("input[name=ecmo_ee]").val(ecmo_kcal.toFixed(0));
        $("input[name=ee_total]").val(ecmo_kcal.toFixed(0));
        $("input[name=kcal_abs]").val(kcal_gesamt.toFixed(0));
    }

    if(kaloriemetrie_modus=="resp_ecmo"){
        var luftdruck_mmhg=ecmo_luftdruck*0.75;
        var vo2=0.134*(ecmo_bf*(ecmo_sao2-ecmo_svo2)*ecmo_hb);
        var vco2=((28/luftdruck_mmhg)*ecmo_bf*1000);
        var ecmo_kcal=((3.9*vo2)+(1.1*vco2))*1.44;
        kcal_gesamt=(parseInt(resp_kcal)+parseInt(ecmo_kcal))*(kaloriemetrie_faktor/100);

        $("input[name=ecmo_vo2]").val(vo2.toFixed(0));
        $("input[name=ecmo_vco2]").val(vco2.toFixed(0));
        $("input[name=ecmo_ee]").val(ecmo_kcal.toFixed(0));
        $("input[name=ee_total]").val(parseInt(resp_kcal)+parseInt(ecmo_kcal));
        $("input[name=kcal_abs]").val(kcal_gesamt.toFixed(0));      
    }

    stufenberechnung_pruefen(5);
}

function berechne_stufe_5(){
    var kcal_abs=parseFloat($("input[name=kcal_abs]").val());
    var ibw=parseFloat($("input[name=prs_ibw_kg]").val());
    var bmigruppe=$("input[name=prs_bmigruppe]").val();
    var bmi1_as=parseFloat($("input[name=prs_as_rel_bmi1_g]").val());
    var crrt_as=parseFloat($("input[name=crrt_as_g]").val());

    var fett_g=(kcal_abs*0.3)/9;
    var glukose_g=(kcal_abs*0.5)/4;
    var as_g=0;
    var gesamt_as_g=0;

    if(bmigruppe=="bmi1"){
        as_g=bmi1_as*ibw;
    }
    else{
        as_g=(kcal_abs*0.2)/4;
    }

    if($("#crrt option:selected").val()=="none"){
        gesamt_as_g=as_g;
    }
    else{
        gesamt_as_g=as_g+crrt_as;
    }

    $("#ergebnis_as_ges_g").val(gesamt_as_g.toFixed(1));
    $("#ergebnis_as_crrt_g").val(crrt_as.toFixed(1));
    $("#ergebnis_fett_g").val(fett_g.toFixed(1));
    $("#ergebnis_glukose_g").val(glukose_g.toFixed(1));
    $("#ergebnis_kcal_abs").val(kcal_abs.toFixed(0));

    $("#ergebnisbereich_hinweis").html("Das aktuelle Kalorienziel <br>("+(kcal_abs/parseFloat($("input[name=prs_gewicht_kg]").val())).toFixed(1)+" kcal/kg ABW &bull; "+(kcal_abs/parseFloat($("input[name=prs_ibw_kg]").val())).toFixed(1)+" kcal/kg IBW) <br>entspricht <b> Ef = "+((kcal_abs/parseFloat($("input[name=prs_gewicht_kg]").val()))/24).toFixed(2)+"</b> von 24 kcal/kg ABW.<br> Das Bezugsgewicht ist "+parseFloat($("input[name=prs_gewicht_kg]").val())+" kg.")
    
}

function auswahlliste_pruefen(auswahlliste){
    if(auswahlliste==1)
    {
        if($("#crrt option:selected").val()=="none"){$("#box_crrt_as").css("display","none");$("#ergebniszeile_crrt_as").css("display","none");stufenberechnung_pruefen(2);}
        else{$("#box_crrt_as").css("display","block");$("#ergebniszeile_crrt_as").css("display","block");stufenberechnung_pruefen(2);}
    }

    if(auswahlliste==2)
    {
        stufenberechnung_pruefen(1);
    }

    if(auswahlliste==3){
        var bmigruppe_manuelleauswahl=$("#bmigruppe option:selected").val();
        $("input[name=kcal_abs]").val('');

        if(bmigruppe_manuelleauswahl=="autoselect"){
            $("#bmigruppe").css("background-color","#f9f9f9");
            $("#warnung_bmi_select").css("display","none");
        }

        else{
            $("#bmigruppe").css("background-color","#ff9497");
            $("#warnung_bmi_select").css("display","block");
        }

        stufenberechnung_pruefen(1);
        stufenberechnung_pruefen(5);
    }

    if(auswahlliste==4){
        var kaloriemetrie_modus=$("#kaloriemetrie_modus option:selected").val();
        $("#rm_berechnungsstufe_4").html("Angaben vervollständigen");
        $("#ee_total").val('');

        if(kaloriemetrie_modus=="resp"){
            $("#wrapper_kaloriemetrie_respirator").css("display","block");
            $("#wrapper_kaloriemetrie_ecmo").css("display","none");
        }

        if(kaloriemetrie_modus=="ecmo"){
            $("#wrapper_kaloriemetrie_respirator").css("display","none");
            $("#wrapper_kaloriemetrie_ecmo").css("display","block");
        }

        if(kaloriemetrie_modus=="resp_ecmo"){
            $("#wrapper_kaloriemetrie_respirator").css("display","block");
            $("#wrapper_kaloriemetrie_ecmo").css("display","block");
        }
        angaben_entfernen("ergebnistabelle");
        stufenberechnung_pruefen(4);
    }

    if(auswahlliste==5){
        var kaloriengrundlage=$("#kaloriengrundlage option:selected").val();
        angaben_entfernen("ergebnistabelle");

        if(kaloriengrundlage=="metrik"){
            $("#box_kaloriemetrie").css("display","none");
            $("#auswahl_bmigruppe").css("display","block");
            $("input[name=kcal_abs]").val('');
            stufenberechnung_pruefen(1);
            stufenberechnung_pruefen(5);
        }

        if(kaloriengrundlage=="kaloriemetrie"){
            $("#box_kaloriemetrie").css("display","block");
            $("#auswahl_bmigruppe").css("display","none");
            $("#box_bmi0").css("display","none");
            $("#box_bmi1").css("display","none");
            $("#box_bmi2").css("display","none");
            if($("input[name=bmi_gruppe_autoselect]").val()=="bmi1"){$("#wrapper_kaloriemetrie_as_bmi1").css("display","block")}
            if($("input[name=bmi_gruppe_autoselect]").val()!="bmi1"){$("#wrapper_kaloriemetrie_as_bmi1").css("display","none")}
            $("input[name=kcal_abs]").val('');
            stufenberechnung_pruefen(4);
            stufenberechnung_pruefen(5);
        }
    }
}

function angaben_entfernen(abschnitt){
    if(abschnitt=="ergebnistabelle"){
        $("input[name=kcal_abs]").val('');
        $("input[name=prs_as_rel_bmi1_g]").val('');

        if($("#kaloriengrundlage option:selected").val()=="metrik"){
            var as_eingabefeld=$(".as_bmi1_input").eq(1);
            if(as_eingabefeld.val()!=""){
                Wert_Pruefen(as_eingabefeld,1.2,2,'prs_as_rel_bmi1_g',3);
            }
        }
        if($("#kaloriengrundlage option:selected").val()=="kaloriemetrie"){
            var as_eingabefeld=$(".as_bmi1_input").eq(0);
            if(as_eingabefeld.val()!=""){
                Wert_Pruefen(as_eingabefeld,1.2,2,'prs_as_rel_bmi1_g',4);
            }
        }

        stufenberechnung_pruefen(5);
    }
}

function anzeigen_ausblenden(bereich,betroffen){
    if (bereich==1){
        $("#experteneinstellungen").toggle();
        var anzeigenstatus=$("#experteneinstellungen").css("display");
        if(anzeigenstatus=="block"){
            $("#experteneinstellungen_header").addClass("header_aktiviert");
            $("#experteneinstellungen_wrapper").addClass("wrapper_aktiviert");
        }
        else{
            $("#experteneinstellungen_header").removeClass("header_aktiviert");
            $("#experteneinstellungen_wrapper").removeClass("wrapper_aktiviert");
        }
    }

    if (bereich==2){
        
        $("#wrapper_abkuerzungen").toggle();
        var anzeigenstatus=$("#wrapper_abkuerzungen").css("display");
    
        if(anzeigenstatus=="block"){
            $(betroffen).removeClass("box_gross_zusammengeklappt");
        }
        else{
            $(betroffen).addClass("box_gross_zusammengeklappt");
        }   
    }

    if(bereich==3){
        $(".zahlenkreis_gr2").toggle();
    }
}