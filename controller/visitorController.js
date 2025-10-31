const Visitor = require("../model/visitorModel");

const getMonthlyVisitors = async (req, res) => {
  try {
    const { year } = req.query;

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    const visitors = await Visitor.aggregate([
      {
        $match: {
          visitDate: {
            $gte: startOfYear,
            $lt: endOfYear
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$visitDate" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    res.status(200).json({ visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMonthlyVisitors };
