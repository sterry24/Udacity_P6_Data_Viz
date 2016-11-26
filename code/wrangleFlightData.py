# -*- coding: utf-8 -*-
"""
Created on Sun Nov 13 17:38:50 2016

@author: Stephen
"""

from collections import OrderedDict
import os
import sys
import pandas as pd
pd.set_option('chained_assignment',None)
import numpy as np
import re

airportData = OrderedDict([
              ('Year',[]),
              ('Origin',[]),
              ('Total_Flts',[]),
              ('Delayed_Flts',[]),
              ('CarrierDelay',[]),
              ('WeatherDelay',[]),
              ('NASDelay',[]),
              ('SecurityDelay',[]),
              ('LateAircraftDelay',[])])
              
carrierData = OrderedDict([
              ('Year',[]),
              ('Carrier',[]),
              ('Origin',[]),
              ('Total_Flts',[]),
              ('Delayed_Flts',[]),
              ('CarrierDelay',[]),
              ('WeatherDelay',[]),
              ('NASDelay',[]),
              ('SecurityDelay',[]),
              ('LateAircraftDelay',[])])

def wrangleData():
    """ This is the main function for processing all flight data
        files downloaded from http://stat-computing.org/dataexpo/2009/the-data.html.
        Filenames are of the format YYYY.csv, where YYYY is any year between
        1987 and 2008."""

    ## Read in the airports.csv file    
    airports = pd.read_csv(r"S:\Stephen\Desktop\DataAnalyst\P6\Project\Submission\data\Downloaded\airports_complete.csv")
    ## Read in the carriers.csv file
    carriers = pd.read_csv(r"S:\Stephen\Desktop\DataAnalyst\P6\Project\Submission\data\Downloaded\carriers.csv")
    ## REGEX to find the correct files in the downloads directory
    fname_regex = re.compile('^[0-9]{4}.csv$')
    ## Path of downloaded data
    path=r"S:\Stephen\Desktop\DataAnalyst\P6\Project\Submission\data\Modified"
    files = os.listdir(path)
    
    for f in files:
        if fname_regex.search(f):
            df = pd.read_csv(os.path.join(path,f))
            print df.Year.unique()[0]
            aggregateAirports(df)
            aggregateCarriers(df)

    ## Data contains US territories that need to be removed
    nonStates = ['AS','GU','VI','PR']

    print airportData
    ## only interested in showing data above 3rd quartile (to limit # of airports in graph)
    df = pd.DataFrame(data=airportData)
    aggADF = pd.DataFrame(columns=df.columns)
    subGroups = df.groupby('Year')
    for idx, (key,subDF) in enumerate(subGroups):
        aggADF = pd.concat([aggADF,subDF[subDF.Total_Flts >= subDF.Total_Flts.describe()['75%']]])
    aggADF.drop_duplicates(inplace=True)
    #aggADF = aggADF[aggADF['Total_Flts'] > aggADF['Total_Flts'].describe()['75%']]
    aggADF['PercentDelayed'] = aggADF.Delayed_Flts/aggADF.Total_Flts
    ## Merge with airports.csv to get the lat/long pos of airports
    aggADF = aggADF.merge(airports,how='left',left_on='Origin',right_on='iata')
    mask = aggADF.state.isin(nonStates)
    aggADF = aggADF[~mask]
    aggADF.to_csv(r"S:\Stephen\Desktop\DataAnalyst\P6\Project\Submission\data\aggregatedAirportData.csv",index=False)


    print carrierData
    ## only interested in showing data above 3rd quartile (to limit # of carriers in graph)
    df = pd.DataFrame(data=carrierData)
    aggCDF = pd.DataFrame(columns=df.columns)
    subGroups = df.groupby('Year')
    for idx, (key,subDF) in enumerate(subGroups):
        tflts = []
        keep = []
        cGroups = subDF.groupby('Carrier')
        for cIdx, (cKey, subCDF) in enumerate(cGroups):
            tflts.append(subCDF.Total_Flts.sum())
        q = np.percentile(tflts,75)
        for cIdx, (cKey, subCDF) in enumerate(cGroups):
            if (subCDF.Total_Flts.sum() >= q):
                keep.append(cKey)
        mask = subDF.Carrier.isin(keep)
        aggCDF = pd.concat([aggCDF,subDF[mask]])
#    aggCDF = pd.DataFrame(data=carrierData)
    aggCDF.drop_duplicates(inplace=True)
    aggCDF['PercentDelayed'] = aggCDF.Delayed_Flts/aggCDF.Total_Flts
    ## Merge with airports.csv to get the lat/long pos of airports
    aggCDF = aggCDF.merge(airports,how='left',left_on='Origin',right_on='iata')
    mask = aggCDF.state.isin(nonStates)
    aggCDF = aggCDF[~mask]
    ## Merge with carriers.csv to get the carrier name from the abbreviation
    aggCDF = aggCDF.merge(carriers,how='left',left_on='Carrier',right_on='Code')
    aggCDF.to_csv(r"S:\Stephen\Desktop\DataAnalyst\P6\Project\Submission\data\aggregatedCarrierData.csv",index=False)


    

def aggregateAirports(df):
    """This function aggregates the data for each airport to be appended to the 
       airportData dict.  It returns the 3rd quartile of total flights, to be 
       used in selecting the which carriers to look at in the carrier study.
       
       PARAMETERS: 
           df: dataFrame of input Airport data for each year available
           
       RETURNS:
           None"""

    subGroups=df.groupby('Origin')
    for idx, (key,subDF) in enumerate(subGroups):
        airportData['Year'].append(subDF.Year.unique()[0])
        airportData['Origin'].append(subDF.Origin.unique()[0])
        airportData['Total_Flts'].append(len(subDF))
        ## A flight is considered late if it departs 15 min or later
        ## than scheduled
        delayDF = subDF[subDF.ArrDelay >= 15]
        airportData['Delayed_Flts'].append(len(delayDF))
        delayDF.CarrierDelay.replace(0,value=np.nan,inplace=True)
        delayDF.WeatherDelay.replace(0,value=np.nan,inplace=True)
        delayDF.NASDelay.replace(0,value=np.nan,inplace=True)
        delayDF.SecurityDelay.replace(0,value=np.nan,inplace=True)
        delayDF.LateAircraftDelay.replace(0,value=np.nan,inplace=True)
        airportData['CarrierDelay'].append(delayDF.CarrierDelay.count())
        airportData['WeatherDelay'].append(delayDF.WeatherDelay.count())
        airportData['NASDelay'].append(delayDF.NASDelay.count())
        airportData['SecurityDelay'].append(delayDF.SecurityDelay.count())
        airportData['LateAircraftDelay'].append(delayDF.LateAircraftDelay.count())
        

def aggregateCarriers(df):
    """This function aggregates the data for each airport to be appended to the 
       airportData dict.  
       
       PARAMETERS: 
           df: dataFrame of input Airport data for each year available
           q : the 3rd quartile of the number of flights in a given year
           
       RETURNS:
           NONE"""
           

    carrierGroups=df.groupby('UniqueCarrier')
    for cIdx, (cKey,subCDF) in enumerate(carrierGroups):
            subGroups = subCDF.groupby('Origin')
            for idx, (key,subDF) in enumerate(subGroups):
                carrierData['Year'].append(subDF.Year.unique()[0])
                carrierData['Carrier'].append(cKey)
                carrierData['Origin'].append(subDF.Origin.unique()[0])
                carrierData['Total_Flts'].append(len(subDF))
                ## A flight is considered late if it departs 15 min or later
                ## than scheduled
                delayDF = subDF[subDF.ArrDelay >= 15]
                carrierData['Delayed_Flts'].append(len(delayDF))
                delayDF.CarrierDelay.replace(0,value=np.nan,inplace=True)
                delayDF.WeatherDelay.replace(0,value=np.nan,inplace=True)
                delayDF.NASDelay.replace(0,value=np.nan,inplace=True)
                delayDF.SecurityDelay.replace(0,value=np.nan,inplace=True)
                delayDF.LateAircraftDelay.replace(0,value=np.nan,inplace=True)
                carrierData['CarrierDelay'].append(delayDF.CarrierDelay.count())
                carrierData['WeatherDelay'].append(delayDF.WeatherDelay.count())
                carrierData['NASDelay'].append(delayDF.NASDelay.count())
                carrierData['SecurityDelay'].append(delayDF.SecurityDelay.count())
                carrierData['LateAircraftDelay'].append(delayDF.LateAircraftDelay.count())


if __name__ == "__main__":
    wrangleData()