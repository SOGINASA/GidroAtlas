import { getAllSensors } from './sensorService';
import { getWaterBodies } from './waterBodyService';
import { getHydroFacilities } from './hydroFacilityService';

// >;CG8BL >1ICN AB0B8AB8:C ?> 2A5< >1J5:B0<
export const getOverallStats = async () => {
  try {
    const [sensors, waterBodies, facilities] = await Promise.all([
      getAllSensors(),
      getWaterBodies(),
      getHydroFacilities()
    ]);

    const sensorsData = sensors.data || sensors || [];
    const waterBodiesData = waterBodies || [];
    const facilitiesData = facilities.data || facilities || [];

    // >4AGQB ?> C@>2=O< >?0A=>AB8
    const criticalCount = sensorsData.filter(s => s.dangerLevel === 'critical').length;
    const dangerCount = sensorsData.filter(s => s.dangerLevel === 'danger').length;
    const safeCount = sensorsData.filter(s => s.dangerLevel === 'safe').length;

    // >4AGQB >1I53> :>;8G5AB20 >1J5:B>2
    const totalObjects = waterBodiesData.length + facilitiesData.length;

    return {
      totalSensors: sensorsData.length,
      totalWaterBodies: waterBodiesData.length,
      totalFacilities: facilitiesData.length,
      totalObjects,
      criticalCount,
      dangerCount,
      safeCount,
      averageConfidence: 87 // !@54=OO B>G=>ABL AI
    };
  } catch (error) {
    console.error('Error fetching overall stats:', error);
    throw error;
  }
};

// >;CG8BL @0A?@545;5=85 ?> ?@8>@8B5B0<
export const getPriorityDistribution = async () => {
  try {
    const [waterBodies, facilities] = await Promise.all([
      getWaterBodies(),
      getHydroFacilities()
    ]);

    const waterBodiesData = waterBodies || [];
    const facilitiesData = facilities.data || facilities || [];

    //  0AGQB ?@8>@8B5B0 4;O :064>3> >1J5:B0
    const allObjects = [...waterBodiesData, ...facilitiesData].map(obj => {
      const condition = obj.technicalCondition || obj.riskLevel === 'critical' ? 5 : obj.riskLevel === 'danger' ? 4 : 2;
      const passportAge = obj.passportDate
        ? new Date().getFullYear() - new Date(obj.passportDate).getFullYear()
        : 3;
      const priorityScore = (6 - condition) * 3 + passportAge;
      const priorityLevel = priorityScore >= 12 ? 'high' : priorityScore >= 6 ? 'medium' : 'low';

      return { ...obj, priority: { level: priorityLevel, score: priorityScore } };
    });

    const highPriority = allObjects.filter(o => o.priority.level === 'high').length;
    const mediumPriority = allObjects.filter(o => o.priority.level === 'medium').length;
    const lowPriority = allObjects.filter(o => o.priority.level === 'low').length;

    return {
      high: highPriority,
      medium: mediumPriority,
      low: lowPriority,
      total: allObjects.length
    };
  } catch (error) {
    console.error('Error fetching priority distribution:', error);
    throw error;
  }
};

// >;CG8BL @0A?@545;5=85 ?> B5E=8G5A:><C A>AB>O=8N
export const getTechnicalConditionDistribution = async () => {
  try {
    const [waterBodies, facilities] = await Promise.all([
      getWaterBodies(),
      getHydroFacilities()
    ]);

    const waterBodiesData = waterBodies || [];
    const facilitiesData = facilities.data || facilities || [];

    // >4AGQB ?> :0B53>@8O< A>AB>O=8O
    const allObjects = [...waterBodiesData, ...facilitiesData];

    const distribution = {
      1: allObjects.filter(o => {
        const condition = o.technicalCondition || (o.riskLevel === 'safe' ? 1 : 3);
        return condition === 1;
      }).length,
      2: allObjects.filter(o => {
        const condition = o.technicalCondition || (o.riskLevel === 'safe' ? 2 : 3);
        return condition === 2;
      }).length,
      3: allObjects.filter(o => {
        const condition = o.technicalCondition || 3;
        return condition === 3;
      }).length,
      4: allObjects.filter(o => {
        const condition = o.technicalCondition || (o.riskLevel === 'danger' ? 4 : 3);
        return condition === 4;
      }).length,
      5: allObjects.filter(o => {
        const condition = o.technicalCondition || (o.riskLevel === 'critical' ? 5 : 3);
        return condition === 5;
      }).length
    };

    return distribution;
  } catch (error) {
    console.error('Error fetching technical condition distribution:', error);
    throw error;
  }
};

// >;CG8BL @0A?@545;5=85 ?> @538>=0<
export const getRegionalDistribution = async () => {
  try {
    const [waterBodies, facilities] = await Promise.all([
      getWaterBodies(),
      getHydroFacilities()
    ]);

    const waterBodiesData = waterBodies || [];
    const facilitiesData = facilities.data || facilities || [];

    const allObjects = [...waterBodiesData, ...facilitiesData];

    // @C??8@>2:0 ?> @538>=0<
    const regionCounts = {};
    allObjects.forEach(obj => {
      const region = obj.region || '58725AB=K9 @538>=';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    // @5>1@07C5< 2 <0AA82 A ?@>F5=B0<8
    const total = allObjects.length;
    const distribution = Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    // !>@B8@C5< ?> :>;8G5AB2C (>B 1>;LH53> : <5=LH5<C)
    distribution.sort((a, b) => b.count - a.count);

    return distribution;
  } catch (error) {
    console.error('Error fetching regional distribution:', error);
    throw error;
  }
};

// >;CG8BL B@5=4K 8 87<5=5=8O (C?@>I5==0O 25@A8O =0 >A=>25 B5:CI8E 40==KE)
export const getTrends = async () => {
  try {
    const sensors = await getAllSensors();
    const sensorsData = sensors.data || sensors || [];

    // >4AGQB C;CGH5=89 8 CEC4H5=89 =0 >A=>25 dangerLevel
    const improved = sensorsData.filter(s => s.dangerLevel === 'safe').length;
    const stable = sensorsData.filter(s => s.dangerLevel === 'danger').length;
    const worsened = sensorsData.filter(s => s.dangerLevel === 'critical').length;

    return {
      improved,
      stable,
      worsened
    };
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};

// >;CG8BL 2A5 0=0;8B8G5A:85 40==K5 A@07C
export const getAllAnalytics = async (timeRange = 'month') => {
  try {
    const [
      overallStats,
      priorityDistribution,
      technicalCondition,
      regionalDistribution,
      trends
    ] = await Promise.all([
      getOverallStats(),
      getPriorityDistribution(),
      getTechnicalConditionDistribution(),
      getRegionalDistribution(),
      getTrends()
    ]);

    return {
      timeRange,
      overallStats,
      priorityDistribution,
      technicalCondition,
      regionalDistribution,
      trends,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    throw error;
  }
};
