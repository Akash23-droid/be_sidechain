const ResumeModel = require("../models/resumeModel");

class ResumeController {
  static async uploadResume(req, res) {
    try {
      const parsedData = await ResumeModel.parseResume(req.file);
      res.json(parsedData);
    } catch (error) {
      console.error("Error processing the file:", error.message);
      res.status(500).send("An error occurred while processing the file.");
    }
  }

  static getData(req, res) {
    // Note: This method assumes parsedData is stored somewhere.
    // You might want to use a database or in-memory storage in a real application.
    if (global.parsedData) {
      res.json(global.parsedData);
    } else {
      res.status(404).send("No data found");
    }
  }
}

module.exports = ResumeController;
